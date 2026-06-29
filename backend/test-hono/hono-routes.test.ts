import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { describe, it } from "node:test";

import app from "../src-hono/app";

const require = createRequire(import.meta.url);
const { resetLeadCashStoreForTests } = require("../src/lib/lead-cash-store.js") as {
  resetLeadCashStoreForTests(): void;
};

async function json(path: string, init?: RequestInit) {
  const response = await app.request(path, init);
  return {
    response,
    body: await response.json(),
  };
}

describe("Hono API route contracts", () => {
  const originalEnv = { ...process.env };
  const originalFetch = global.fetch;

  function configureAdminEnv() {
    process.env.GOOGLE_OAUTH_CLIENT_ID = "test-client";
    process.env.ADMIN_SESSION_SECRET = "x".repeat(40);
    process.env.ADMIN_ALLOWED_EMAILS = "owner@example.com";
    delete process.env.ADMIN_ALLOWED_DOMAIN;
  }

  function restoreEnv() {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
    resetLeadCashStoreForTests();
  }

  async function createAdminCookie() {
    configureAdminEnv();
    global.fetch = async () =>
      new Response(
        JSON.stringify({
          aud: "test-client",
          email: "owner@example.com",
          email_verified: true,
          name: "Owner",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );

    const login = await app.request("/api/admin/auth/google", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken: "valid-token" }),
    });

    assert.equal(login.status, 200);
    return login.headers.get("set-cookie") ?? "";
  }

  function leadPayload(overrides: Record<string, unknown> = {}) {
    return {
      name: "Test Lead",
      phone: "541-555-1212",
      serviceType: "inspection-repairs",
      urgency: "standard",
      message: "Need a route review.",
      ...overrides,
    };
  }

  it("returns health statuses with disabled providers", async () => {
    const { response, body } = await json("/health");
    assert.equal(response.status, 200);
    assert.equal(body.services.sms, "disabled");
    assert.equal(body.integrations.quickbooks.status, "disabled");
  });

  it("returns public services", async () => {
    const { response, body } = await json("/api/services");
    assert.equal(response.status, 200);
    assert.ok(
      body.services.some((service: { serviceType: string }) => service.serviceType === "window-door-replacements"),
    );
  });

  it("validates lead submissions", async () => {
    const { response, body } = await json("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Test" }),
    });

    assert.equal(response.status, 400);
    assert.equal(body.error.code, "VALIDATION_ERROR");
  });

  it("accepts complete lead submissions", async () => {
    const { response, body } = await json("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(leadPayload()),
    });

    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.match(body.leadId, /^[0-9a-f-]{36}$/);
    assert.equal(typeof body.delivery.delivered, "boolean");
  });

  it("creates a lead-cash workflow after complete lead submissions", async () => {
    try {
      const { response, body } = await json("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(leadPayload({ sourcePage: "/contact", turnstileToken: "do-not-store" })),
      });
      assert.equal(response.status, 201);

      const cookie = await createAdminCookie();
      const workflowResponse = await app.request(`/api/lead-cash/workflows/${body.leadId}`, {
        headers: { cookie },
      });
      const workflowBody = await workflowResponse.json();

      assert.equal(workflowResponse.status, 200);
      assert.equal(workflowBody.workflow.id, body.leadId);
      assert.equal(workflowBody.workflow.state, "lead");
      assert.equal(workflowBody.workflow.metadata.sourcePage, "/contact");
      assert.equal(JSON.stringify(workflowBody).includes("do-not-store"), false);
    } finally {
      restoreEnv();
    }
  });

  it("validates Hono subscription recommendation query numbers", async () => {
    const invalidHomeValue = await json(
      "/api/tools/subscription-recommendation?propertyType=residential&squareFootage=2200&propertyAge=12&homeValue=abc&region=harney-county",
    );
    assert.equal(invalidHomeValue.response.status, 400);
    assert.equal(invalidHomeValue.body.error.code, "VALIDATION_ERROR");
    assert.match(invalidHomeValue.body.error.message, /homeValue/i);

    const negativeSquareFootage = await json(
      "/api/tools/subscription-recommendation?propertyType=residential&squareFootage=-1&propertyAge=12&region=harney-county",
    );
    assert.equal(negativeSquareFootage.response.status, 400);
    assert.equal(negativeSquareFootage.body.error.code, "VALIDATION_ERROR");
    assert.match(negativeSquareFootage.body.error.message, /squareFootage/i);

    const missingRequired = await json(
      "/api/tools/subscription-recommendation?propertyType=residential&region=harney-county",
    );
    assert.equal(missingRequired.response.status, 400);
    assert.equal(missingRequired.body.error.code, "VALIDATION_ERROR");
    assert.match(missingRequired.body.error.message, /squareFootage|propertyAge/i);
  });

  it("returns Hono subscription recommendation for valid Harney County inputs", async () => {
    const { response, body } = await json(
      "/api/tools/subscription-recommendation?propertyType=residential&squareFootage=2200&propertyAge=12&homeValue=450000&region=harney-county",
    );

    assert.equal(response.status, 200);
    assert.equal(body.recommendedPlan.id, "standard");
    assert.equal(body.assumptions.ageBasedRate, 0.02);
    assert.equal(body.assumptions.annualMaintenanceCost, 9000);
    assert.equal(body.assumptions.annualSubscriptionCost, 1788);
    assert.equal(body.annualSavings, 7212);
    assert.match(body.disclaimer, /educational/i);
  });

  it("accepts complete emergency submissions through durable intake", async () => {
    const { response, body } = await json("/api/emergency-requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Test Emergency",
        phone: "541-555-1212",
        serviceType: "emergency-response",
        urgency: "emergency",
        message: "Active water intrusion needs review.",
      }),
    });

    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.match(body.leadId, /^[0-9a-f-]{36}$/);
    assert.equal(typeof body.delivery.delivered, "boolean");
  });

  it("requires admin session for dashboard", async () => {
    configureAdminEnv();
    try {
      const { response, body } = await json("/api/admin/dashboard");
      assert.equal(response.status, 401);
      assert.equal(body.error.code, "UNAUTHORIZED");
    } finally {
      restoreEnv();
    }
  });

  it("creates a Google-backed admin session and unlocks dashboard", async () => {
    configureAdminEnv();
    global.fetch = async () =>
      new Response(
        JSON.stringify({
          aud: "test-client",
          email: "owner@example.com",
          email_verified: "true",
          name: "Owner",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );

    try {
      const login = await app.request("/api/admin/auth/google", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken: "valid-token" }),
      });
      const cookie = login.headers.get("set-cookie");
      assert.equal(login.status, 200);
      assert.match(cookie ?? "", /HttpOnly/);

      const dashboard = await app.request("/api/admin/dashboard", {
        headers: { cookie: cookie ?? "" },
      });
      const body = await dashboard.json();
      assert.equal(dashboard.status, 200);
      assert.equal(body.dashboard.admin.email, "owner@example.com");
      assert.equal(body.dashboard.sections.includes("Audit Log"), true);
      assert.equal(JSON.stringify(body).includes(process.env.ADMIN_SESSION_SECRET ?? ""), false);
    } finally {
      restoreEnv();
    }
  });

  it("requires confirmation for mutating admin integration checks and writes audit entries", async () => {
    configureAdminEnv();
    global.fetch = async () =>
      new Response(
        JSON.stringify({
          aud: "test-client",
          email: "owner@example.com",
          email_verified: true,
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );

    try {
      const login = await app.request("/api/admin/auth/google", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken: "valid-token" }),
      });
      const cookie = login.headers.get("set-cookie") ?? "";

      const rejected = await app.request("/api/admin/integrations/email/check", {
        method: "POST",
        headers: { "content-type": "application/json", cookie },
        body: JSON.stringify({ confirm: false }),
      });
      const rejectedBody = await rejected.json();
      assert.equal(rejected.status, 400);
      assert.equal(rejectedBody.error.code, "CONFIRMATION_REQUIRED");

      const accepted = await app.request("/api/admin/integrations/email/check", {
        method: "POST",
        headers: { "content-type": "application/json", cookie },
        body: JSON.stringify({ confirm: true }),
      });
      const acceptedBody = await accepted.json();
      assert.equal(accepted.status, 200);
      assert.equal(acceptedBody.audit.action, "integration.check");
      assert.equal(acceptedBody.status.status, "disabled");

      const audit = await app.request("/api/admin/audit-log", { headers: { cookie } });
      const auditBody = await audit.json();
      assert.equal(audit.status, 200);
      assert.ok(auditBody.auditLog.some((entry: { target: string }) => entry.target === "email"));
    } finally {
      restoreEnv();
    }
  });

  it("requires admin session for lead-cash workflow lookup", async () => {
    configureAdminEnv();
    try {
      const { response, body } = await json("/api/lead-cash/workflows/missing");
      assert.equal(response.status, 401);
      assert.equal(body.error.code, "UNAUTHORIZED");
    } finally {
      restoreEnv();
    }
  });

  it("fails lead-cash webhooks closed without configured secret", async () => {
    try {
      delete process.env.LEAD_CASH_WEBHOOK_SECRET;
      const { response, body } = await json("/api/lead-cash/webhooks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ workflowId: "missing", eventType: "estimate.created" }),
      });

      assert.equal(response.status, 503);
      assert.equal(body.error.code, "WEBHOOK_SECRET_NOT_CONFIGURED");
    } finally {
      restoreEnv();
    }
  });

  it("rejects lead-cash webhooks without matching secret header", async () => {
    try {
      process.env.LEAD_CASH_WEBHOOK_SECRET = "test-webhook-secret";

      const missingHeader = await json("/api/lead-cash/webhooks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ workflowId: "missing", eventType: "estimate.created" }),
      });
      assert.equal(missingHeader.response.status, 401);
      assert.equal(missingHeader.body.error.code, "UNAUTHORIZED");

      const wrongHeader = await json("/api/lead-cash/webhooks", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-lead-cash-webhook-secret": "wrong-secret",
        },
        body: JSON.stringify({ workflowId: "missing", eventType: "estimate.created" }),
      });
      assert.equal(wrongHeader.response.status, 401);
      assert.equal(wrongHeader.body.error.code, "UNAUTHORIZED");
    } finally {
      restoreEnv();
    }
  });

  it("accepts authenticated lead-cash webhooks and advances existing workflows", async () => {
    try {
      process.env.LEAD_CASH_WEBHOOK_SECRET = "test-webhook-secret";
      const lead = await json("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(leadPayload()),
      });
      assert.equal(lead.response.status, 201);

      const webhook = await json("/api/lead-cash/webhooks", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-lead-cash-webhook-secret": "test-webhook-secret",
        },
        body: JSON.stringify({
          workflowId: lead.body.leadId,
          eventType: "estimate.created",
          provider: "test",
          providerEventId: "evt-estimate-created",
        }),
      });

      assert.equal(webhook.response.status, 200);
      assert.equal(webhook.body.success, true);
      assert.equal(webhook.body.applied, true);
      assert.equal(webhook.body.workflow.state, "estimate");
    } finally {
      restoreEnv();
    }
  });
});
