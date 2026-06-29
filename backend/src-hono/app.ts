import { randomUUID, timingSafeEqual } from "node:crypto";
import { createRequire } from "node:module";

import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import {
  getStaticImages,
  getStaticPlans,
  getStaticServiceAreas,
  getStaticServices,
} from "@benson/shared";

import { getIntegrationHealth, summarizeStatus } from "./provider-health";

const require = createRequire(import.meta.url);
const { ApiError, toErrorResponse } = require("../src/lib/errors.js") as {
  ApiError: new (statusCode: number, code: string, message: string, details?: Record<string, unknown>) => Error;
  toErrorResponse(error: unknown): {
    statusCode: number;
    payload: {
      error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
      };
    };
  };
};
const { submitEmergencyRequest } = require("../src/services/emergency-requests.js") as {
  submitEmergencyRequest(payload: unknown): Promise<DurableSubmissionResult>;
};
const { submitLeadRequest } = require("../src/services/leads.js") as {
  submitLeadRequest(payload: unknown): Promise<DurableSubmissionResult>;
};
const {
  clearAdminSessionCookie,
  createAdminSessionCookie,
  getAdminSession,
  requireAdminSession,
  verifyGoogleAdminToken,
} = require("../src/lib/admin-auth.js") as {
  clearAdminSessionCookie(): string;
  createAdminSessionCookie(profile: AdminUser): string;
  getAdminSession(request: LegacyRequest): AdminSession | null;
  requireAdminSession(request: LegacyRequest): AdminSession;
  verifyGoogleAdminToken(idToken: unknown): Promise<AdminUser>;
};
const {
  getLeadCashWorkflowSnapshot,
  handleLeadCashWebhook,
  recordLeadCashIntake,
} = require("../src/services/lead-cash.js") as {
  getLeadCashWorkflowSnapshot(workflowId: string): Promise<unknown | null>;
  handleLeadCashWebhook(payload: unknown): Promise<{
    applied?: boolean;
    reason?: string;
    workflow?: unknown;
  }>;
  recordLeadCashIntake(args: {
    leadId: string;
    sourceKind: string;
    submission: Record<string, unknown>;
    occurredAt: string;
    metadata?: Record<string, unknown>;
  }): Promise<unknown | null>;
};
const { getSubscriptionRecommendation } = require("../src/services/subscription-recommendation.js") as {
  getSubscriptionRecommendation(searchParams: URLSearchParams): unknown;
};

interface DurableSubmissionResult {
  success: true;
  leadId: string;
  message: string;
  createdAt: string;
  delivery: {
    delivered: boolean;
    reason?: string;
  };
}

interface AdminUser {
  email: string;
  name?: string;
  picture?: string | null;
}

interface AdminSession {
  user: AdminUser;
  expiresAt: string;
}

interface LegacyRequest {
  headers: {
    cookie?: string;
  };
}

const auditLog: Array<{
  id: string;
  action: string;
  actor: string;
  target: string;
  createdAt: string;
}> = [];

const app = new Hono();

function toLegacyRequest(context: Context): LegacyRequest {
  return {
    headers: {
      cookie: context.req.header("cookie"),
    },
  };
}

function requireHonoAdminSession(context: Context): AdminSession {
  return requireAdminSession(toLegacyRequest(context));
}

function writeAudit(action: string, session: AdminSession, target: string) {
  const entry = {
    id: randomUUID(),
    action,
    actor: session.user.email,
    target,
    createdAt: new Date().toISOString(),
  };
  auditLog.push(entry);
  return entry;
}

function sanitizeLeadCashSubmission(payload: unknown): Record<string, unknown> {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return {};
  }

  const { turnstileToken: _turnstileToken, ...submission } = payload as Record<string, unknown>;
  return submission;
}

function verifyLeadCashWebhookSecret(context: Context) {
  const secret = process.env.LEAD_CASH_WEBHOOK_SECRET;

  if (!secret) {
    throw new ApiError(503, "WEBHOOK_SECRET_NOT_CONFIGURED", "Lead-cash webhook secret is not configured.");
  }

  const header = context.req.header("x-lead-cash-webhook-secret");
  if (!header) {
    throw new ApiError(401, "UNAUTHORIZED", "Lead-cash webhook secret is required.");
  }

  const expected = Buffer.from(secret);
  const actual = Buffer.from(header);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new ApiError(401, "UNAUTHORIZED", "Lead-cash webhook secret is invalid.");
  }
}

app.use("*", async (context, next) => {
  context.header("x-request-id", context.req.header("x-request-id") ?? randomUUID());
  await next();
});

app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowedOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:4321";
      return origin === allowedOrigin ? origin : allowedOrigin;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["content-type", "authorization", "x-request-id", "x-lead-cash-webhook-secret"],
  }),
);

app.onError((error, context) => {
  if (error instanceof HTTPException) {
    return context.json(
      { error: { code: error.status === 404 ? "NOT_FOUND" : "REQUEST_ERROR", message: error.message } },
      error.status,
    );
  }

  const { statusCode, payload } = toErrorResponse(error);
  if (statusCode !== 500 || payload.error.code !== "INTERNAL_ERROR") {
    return context.json(payload, statusCode as ContentfulStatusCode);
  }

  return context.json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Unexpected server error." } }, 500);
});

app.get("/health", (context) => {
  const integrations = getIntegrationHealth();

  return context.json({
    status: summarizeStatus(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.1.0",
    services: Object.fromEntries(Object.entries(integrations).map(([key, value]) => [key, value.status])),
    integrations,
  });
});

app.get("/api/services", (context) => context.json({ services: getStaticServices() }));
app.get("/api/images", (context) => context.json({ images: getStaticImages() }));
app.get("/api/plans", (context) => context.json({ plans: getStaticPlans() }));
app.get("/api/service-areas", (context) => context.json({ areas: getStaticServiceAreas() }));

app.get("/api/tools/subscription-recommendation", (context) => {
  return context.json(getSubscriptionRecommendation(new URL(context.req.url).searchParams));
});

app.get("/api/admin/session", (context) => context.json({ session: getAdminSession(toLegacyRequest(context)) }));

app.post("/api/admin/auth/google", async (context) => {
  const { idToken } = await context.req.json();
  const user = await verifyGoogleAdminToken(idToken);
  context.header("set-cookie", createAdminSessionCookie(user));
  return context.json({ session: { user } });
});

app.post("/api/admin/logout", (context) => {
  context.header("set-cookie", clearAdminSessionCookie());
  return context.json({ success: true });
});

app.get("/api/admin/dashboard", (context) => {
  const session = requireHonoAdminSession(context);
  return context.json({
    dashboard: {
      generatedAt: new Date().toISOString(),
      admin: session.user,
      overview: {
        health: summarizeStatus(),
        openLeads: 0,
        urgentRequests: 0,
        pendingApprovals: 0,
      },
      sections: [
        "Overview",
        "Leads",
        "Emergency Requests",
        "Lead-Cash",
        "Integrations",
        "Site Content",
        "Deployments",
        "Settings",
        "Audit Log",
      ],
      integrations: getIntegrationHealth(),
      auditLog: auditLog.slice(-25),
    },
  });
});

app.get("/api/admin/audit-log", (context) => {
  requireHonoAdminSession(context);
  return context.json({ auditLog: auditLog.slice(-100) });
});

app.post("/api/admin/integrations/:integration/check", async (context) => {
  const session = requireHonoAdminSession(context);
  const body = await context.req.json().catch(() => ({}));
  const integration = context.req.param("integration");

  if (body?.confirm !== true) {
    return context.json(
      {
        error: {
          code: "CONFIRMATION_REQUIRED",
          message: "Integration checks require explicit confirmation.",
        },
      },
      400,
    );
  }

  const integrations = getIntegrationHealth();
  const status = integrations[integration as keyof typeof integrations];

  if (!status) {
    return context.json({ error: { code: "NOT_FOUND", message: `Integration ${integration} was not found.` } }, 404);
  }

  return context.json({
    success: true,
    integration,
    status,
    audit: writeAudit("integration.check", session, integration),
  });
});

app.post("/api/leads", async (context) => {
  const payload = await context.req.json();
  const result = await submitLeadRequest(payload);
  await recordLeadCashIntake({
    leadId: result.leadId,
    sourceKind: "website",
    submission: sanitizeLeadCashSubmission(payload),
    occurredAt: result.createdAt,
    metadata: {
      delivery: result.delivery,
    },
  });
  return context.json(result, 201);
});

app.post("/api/emergency-requests", async (context) => {
  const result = await submitEmergencyRequest(await context.req.json());
  return context.json(result, 201);
});

app.get("/api/lead-cash/workflows/:workflowId", async (context) => {
  requireHonoAdminSession(context);
  const workflowId = context.req.param("workflowId");
  const workflow = await getLeadCashWorkflowSnapshot(workflowId);

  if (!workflow) {
    return context.json({ error: { code: "NOT_FOUND", message: `Workflow ${workflowId} was not found.` } }, 404);
  }

  return context.json({ workflow });
});

app.post("/api/lead-cash/webhooks", async (context) => {
  verifyLeadCashWebhookSecret(context);
  const result = await handleLeadCashWebhook(await context.req.json());
  return context.json({
    success: true,
    applied: result.applied,
    reason: result.reason,
    workflow: result.workflow,
  });
});

export default app;
