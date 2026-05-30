import test from "node:test";
import assert from "node:assert/strict";

import { createServer } from "../src/app.js";
import { getEmergencyStoreSnapshot } from "../src/services/emergency-requests.js";
import { resetSubmissionStoreForTests } from "../src/lib/submission-store.js";

test.beforeEach(() => {
  resetSubmissionStoreForTests();
});

function withEnv(overrides, handler) {
  const previousValues = new Map();

  for (const [key, value] of Object.entries(overrides)) {
    previousValues.set(key, process.env[key]);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  return Promise.resolve()
    .then(handler)
    .finally(() => {
      for (const [key, value] of previousValues.entries()) {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
      resetSubmissionStoreForTests();
    });
}

async function withResendMock(response, handler) {
  const originalFetch = global.fetch;

  global.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;

    if (url === "https://api.resend.com/emails") {
      return new Response(JSON.stringify(response.body ?? { id: "email-test-id" }), {
        status: response.status ?? 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    return originalFetch(input, init);
  };

  try {
    await handler();
  } finally {
    global.fetch = originalFetch;
  }
}

async function postJson(server, path, payload) {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    return { response, json };
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

async function requestWithOptions(server, path, options) {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();

  try {
    return await fetch(`http://127.0.0.1:${address.port}${path}`, options);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

test("POST /api/emergency-requests accepts a valid emergency request and returns stable id", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/emergency-requests", {
    name: "Test User",
    phone: "541-321-5115",
    email: "office@bensonhomesolutions.com",
    address: "123 Main St",
    city: "Burns",
    zipCode: "97720",
    serviceType: "water-mold-moisture",
    message: "Active water intrusion in basement. Need route-aware review.",
    urgency: "emergency",
  });

  assert.equal(response.status, 201);
  assert.equal(json.success, true);
  assert.match(json.leadId, /^[0-9a-f-]{36}$/);
  assert.match(json.message, /received/i);
  assert.match(json.createdAt, /\d{4}-\d{2}-\d{2}T/);
  assert.equal(typeof json.delivery.delivered, "boolean");
  assert.equal(typeof json.delivery, "object");
  assert.equal(Array.isArray(json.delivery), false);
  assert.equal("leadId" in json.delivery, false);
  assert.equal("lead" in json, false);
});

test("POST /api/emergency-requests stores the submission and sends email when configured", async () => {
  await withEnv(
    {
      EMAIL_API_KEY: "resend-test-key",
      EMAIL_FROM: "Benson Home Solutions <office@bensonhomesolutions.com>",
      EMAIL_TO: "office@bensonhomesolutions.com",
    },
    async () => {
      await withResendMock({ status: 200, body: { id: "email-456" } }, async () => {
        const server = createServer();
        const { response, json } = await postJson(server, "/api/emergency-requests", {
          name: "Test User",
          phone: "541-321-5115",
          email: "office@bensonhomesolutions.com",
          address: "123 Main St",
          city: "Burns",
          zipCode: "97720",
          serviceType: "water-mold-moisture",
          message: "Active water intrusion in basement. Need route-aware review.",
          urgency: "emergency",
        });

        assert.equal(response.status, 201);
        assert.equal(json.delivery.delivered, true);

        const snapshot = getEmergencyStoreSnapshot();
        assert.equal(snapshot.length, 1);
        assert.equal(snapshot[0].deliveryDelivered, true);
        assert.equal(snapshot[0].deliveryMessageId, "email-456");
      });
    },
  );
});

test("POST /api/emergency-requests rejects non-emergency urgency", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/emergency-requests", {
    name: "Test User",
    phone: "541-321-5115",
    serviceType: "inspection-repairs",
    message: "Need help soon.",
    urgency: "standard",
  });

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /urgency.*emergency/i);
});

test("POST /api/emergency-requests rejects urgency 'soon'", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/emergency-requests", {
    name: "Test User",
    phone: "541-321-5115",
    serviceType: "inspection-repairs",
    message: "Need help soon.",
    urgency: "soon",
  });

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /urgency.*emergency/i);
});

test("POST /api/emergency-requests reuses lead validation for email", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/emergency-requests", {
    name: "Test User",
    phone: "541-321-5115",
    email: "not-an-email",
    serviceType: "inspection-repairs",
    message: "Need help.",
    urgency: "emergency",
  });

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /email/i);
});

test("POST /api/emergency-requests reuses lead validation for phone", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/emergency-requests", {
    name: "Test User",
    phone: "abc",
    serviceType: "inspection-repairs",
    message: "Need help.",
    urgency: "emergency",
  });

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /phone/i);
});

test("POST /api/emergency-requests reuses lead validation for message length", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/emergency-requests", {
    name: "Test User",
    phone: "541-321-5115",
    serviceType: "inspection-repairs",
    message: "x".repeat(2001),
    urgency: "emergency",
  });

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /message/i);
});

test("POST /api/emergency-requests reuses lead validation for serviceType", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/emergency-requests", {
    name: "Test User",
    phone: "541-321-5115",
    serviceType: "invalid-service",
    message: "Need help.",
    urgency: "emergency",
  });

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /serviceType/i);
});

test("POST /api/emergency-requests requires all lead required fields", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/emergency-requests", {
    name: "Test User",
    message: "Missing phone and serviceType",
    urgency: "emergency",
  });

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.ok(Array.isArray(json.error.details.fields));
  assert.equal(json.error.details.fields.includes("phone"), true);
  assert.equal(json.error.details.fields.includes("serviceType"), true);
});

test("POST /api/emergency-requests handles invalid JSON", async () => {
  const server = createServer();
  const response = await requestWithOptions(server, "/api/emergency-requests", {
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
});

test("POST /api/emergency-requests rejects array payloads", async () => {
  const server = createServer();
  const response = await requestWithOptions(server, "/api/emergency-requests", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify([
      { name: "Test User" },
    ]),
  });
  const json = await response.json();

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /object/i);
});

test("POST /api/emergency-requests returns 405 for GET", async () => {
  const server = createServer();
  const response = await requestWithOptions(server, "/api/emergency-requests", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  const json = await response.json();

  assert.equal(response.status, 405);
  assert.equal(json.error.code, "METHOD_NOT_ALLOWED");
});

test("OPTIONS /api/emergency-requests returns preflight metadata", async () => {
  const server = createServer();
  const response = await requestWithOptions(server, "/api/emergency-requests", {
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
