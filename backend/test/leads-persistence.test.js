import test from "node:test";
import assert from "node:assert/strict";

import { createServer } from "../src/app.js";
import { getLeadStoreSnapshot } from "../src/services/leads.js";
import { resetSubmissionStoreForTests } from "../src/lib/submission-store.js";
import { withEnv } from "../test-support/env.js";
import {
  mockResendFetch,
  mockTwilioFetch,
  postJson,
  requestWithOptions,
  withMockedFetch,
} from "../test-support/submission.js";

test.beforeEach(() => {
  resetSubmissionStoreForTests();
});

test("POST /api/leads stores a submission durably and sends a Resend email when configured", async () => {
  await withEnv(
    {
      EMAIL_API_KEY: "resend-test-key",
      EMAIL_FROM: "Benson Home Solutions <office@bensonhomesolutions.com>",
      EMAIL_TO: "office@bensonhomesolutions.com",
      TWILIO_ACCOUNT_SID: "AC1234567890",
      TWILIO_AUTH_TOKEN: "twilio-test-token",
      TWILIO_FROM_NUMBER: "+15413215115",
      SMS_TO: "+15414130480",
    },
    async () => {
      await withMockedFetch(
        [
          mockResendFetch({ status: 200, body: { id: "email-123" } }),
          mockTwilioFetch({ status: 201, body: { sid: "sms-123" } }),
        ],
        async () => {
        const server = createServer();
        const { response, json } = await postJson(server, "/api/leads", {
          name: "Test User",
          phone: "458-723-0818",
          email: "office@bensonhomesolutions.com",
          city: "Burns",
          zipCode: "97720",
          serviceType: "inspection-repairs",
          message: "Need help closing out two inspection items before sale.",
          urgency: "soon",
          sourcePage: "/services/inspection-repairs",
        });

        assert.equal(response.status, 201);
        assert.equal(json.delivery.delivered, true);
        assert.equal(json.delivery.reason, undefined);

        const snapshot = getLeadStoreSnapshot();
        assert.equal(snapshot.length, 1);
        assert.equal(snapshot[0].deliveryDelivered, true);
        assert.equal(snapshot[0].deliveryProvider, "resend");
        assert.equal(snapshot[0].deliveryMessageId, "email-123");
        assert.equal(snapshot[0].emailDeliveryDelivered, true);
        assert.equal(snapshot[0].emailDeliveryProvider, "resend");
        assert.equal(snapshot[0].emailDeliveryMessageId, "email-123");
        assert.equal(snapshot[0].smsDeliveryDelivered, true);
        assert.equal(snapshot[0].smsDeliveryProvider, "twilio");
        assert.equal(snapshot[0].smsDeliveryMessageId, "sms-123");
        },
      );
    },
  );
});

test("POST /api/leads keeps the stored submission when email delivery fails", async () => {
  await withEnv(
    {
      EMAIL_API_KEY: "resend-test-key",
      EMAIL_FROM: "Benson Home Solutions <office@bensonhomesolutions.com>",
      EMAIL_TO: "office@bensonhomesolutions.com",
      TWILIO_ACCOUNT_SID: "AC1234567890",
      TWILIO_AUTH_TOKEN: "twilio-test-token",
      TWILIO_FROM_NUMBER: "+15413215115",
      SMS_TO: "+15414130480",
    },
    async () => {
      await withMockedFetch(
        [
          mockResendFetch({ status: 500, body: { error: "failed" } }),
          mockTwilioFetch({ status: 201, body: { sid: "sms-123" } }),
        ],
        async () => {
        const server = createServer();
        const { response, json } = await postJson(server, "/api/leads", {
          name: "Test User",
          phone: "458-723-0818",
          email: "office@bensonhomesolutions.com",
          city: "Burns",
          zipCode: "97720",
          serviceType: "inspection-repairs",
          message: "Need help closing out two inspection items before sale.",
          urgency: "soon",
        });

        assert.equal(response.status, 201);
        assert.equal(json.delivery.delivered, false);
        assert.equal(json.delivery.reason, "email_delivery_failed");

        const snapshot = getLeadStoreSnapshot();
        assert.equal(snapshot.length, 1);
        assert.equal(snapshot[0].deliveryDelivered, false);
        assert.equal(snapshot[0].deliveryReason, "email_delivery_failed");
        assert.equal(snapshot[0].smsDeliveryDelivered, true);
        },
      );
    },
  );
});

test("POST /api/leads returns 503 when durable storage is unavailable", async () => {
  await withEnv(
    {
      LEAD_STORAGE_BACKEND: "unavailable",
    },
    async () => {
      const server = createServer();
      const { response, json } = await postJson(server, "/api/leads", {
        name: "Test User",
        phone: "458-723-0818",
        serviceType: "inspection-repairs",
        message: "Need help closing out two inspection items before sale.",
        urgency: "soon",
      });

      assert.equal(response.status, 503);
      assert.equal(json.error.code, "DATABASE_UNAVAILABLE");
    },
  );
});

test("POST /api/leads includes access-control-allow-origin for allowed origins", async () => {
  const previousFrontendOrigin = process.env.FRONTEND_ORIGIN;
  process.env.FRONTEND_ORIGIN = "https://bensonhomesolutions.com";

  try {
    const server = createServer();
    const { response } = await postJson(server, "/api/leads", {
      name: "Test User",
      phone: "458-723-0818",
      serviceType: "inspection-repairs",
      message: "Need help closing out two inspection items before sale.",
      urgency: "soon",
    });

    assert.equal(response.headers.get("access-control-allow-origin"), null);
  } finally {
    process.env.FRONTEND_ORIGIN = previousFrontendOrigin;
  }
});

test("POST /api/leads includes access-control-allow-origin when request origin is allowed", async () => {
  const previousFrontendOrigin = process.env.FRONTEND_ORIGIN;
  process.env.FRONTEND_ORIGIN = "https://bensonhomesolutions.com";

  try {
    const server = createServer();
    const response = await requestWithOptions(server, "/api/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://bensonhomesolutions.com",
      },
      body: JSON.stringify({
        name: "Test User",
        phone: "458-723-0818",
        serviceType: "inspection-repairs",
        message: "Need help closing out two inspection items before sale.",
        urgency: "soon",
      }),
    });

    assert.equal(response.headers.get("access-control-allow-origin"), "https://bensonhomesolutions.com");
  } finally {
    process.env.FRONTEND_ORIGIN = previousFrontendOrigin;
  }
});

test("POST /api/leads omits access-control-allow-origin when request origin is disallowed", async () => {
  const previousFrontendOrigin = process.env.FRONTEND_ORIGIN;
  process.env.FRONTEND_ORIGIN = "https://bensonhomesolutions.com";

  try {
    const server = createServer();
    const response = await requestWithOptions(server, "/api/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://evil.example.com",
      },
      body: JSON.stringify({
        name: "Test User",
        phone: "458-723-0818",
        serviceType: "inspection-repairs",
        message: "Need help closing out two inspection items before sale.",
        urgency: "soon",
      }),
    });

    assert.equal(response.headers.get("access-control-allow-origin"), null);
  } finally {
    process.env.FRONTEND_ORIGIN = previousFrontendOrigin;
  }
});

test("POST /api/leads returns the standard ApiError contract for invalid JSON bodies", async () => {
  const server = createServer();
  const response = await requestWithOptions(server, "/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: '{"name":"Test User",',
  });
  const json = await response.json();

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "INVALID_JSON");
  assert.match(json.error.message, /json/i);
});

test("OPTIONS /api/leads returns preflight metadata for allowed request headers and methods", async () => {
  const server = createServer();
  const response = await requestWithOptions(server, "/api/leads", {
    method: "OPTIONS",
    headers: {
      origin: "http://localhost:5173",
    },
  });

  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-methods"), "GET,POST,OPTIONS");
  assert.equal(response.headers.get("access-control-allow-headers"), "content-type");
  assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:5173");
});

test("unsupported methods on known routes return 405 with the standard ApiError contract", async () => {
  const server = createServer();
  const response = await requestWithOptions(server, "/api/leads", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: "Test User",
    }),
  });
  const json = await response.json();

  assert.equal(response.status, 405);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "METHOD_NOT_ALLOWED");
  assert.match(json.error.message, /PUT/i);
});

test("POST /api/leads rejects array payloads with the standard ApiError contract", async () => {
  const server = createServer();
  const response = await requestWithOptions(server, "/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify([
      {
        name: "Test User",
      },
    ]),
  });
  const json = await response.json();

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /object/i);
});

test("POST /api/leads rejects string payloads with the standard ApiError contract", async () => {
  const server = createServer();
  const response = await requestWithOptions(server, "/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify("not an object"),
  });
  const json = await response.json();

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /object/i);
});

test("POST /api/leads rejects null payloads with the standard ApiError contract", async () => {
  const server = createServer();
  const response = await requestWithOptions(server, "/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: "null",
  });
  const json = await response.json();

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /object/i);
});
