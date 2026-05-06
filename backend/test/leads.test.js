import test from "node:test";
import assert from "node:assert/strict";

import { createServer } from "../src/app.js";
import { getLeadStoreSnapshot, submitLeadRequest } from "../src/services/leads.js";

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

test("POST /api/leads accepts a valid lead and returns a stable lead id", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/leads", {
    name: "Test User",
    phone: "541-321-5115",
    email: "office@bensonhomesolutions.com",
    city: "Sweet Home",
    zipCode: "97386",
    serviceType: "inspection-repairs",
    message: "Need help closing out two inspection items before sale.",
    urgency: "soon",
    sourcePage: "/services/inspection-repairs",
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

test("POST /api/leads rejects incomplete payloads with predictable validation errors", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/leads", {
    name: "Test User",
    message: "Missing required fields",
    urgency: "soon",
  });

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.ok(Array.isArray(json.error.details.fields));
  assert.equal(json.error.details.fields.includes("phone"), true);
  assert.equal(json.error.details.fields.includes("serviceType"), true);
});

test("POST /api/leads rejects invalid email addresses with the standard ApiError contract", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/leads", {
    name: "Test User",
    phone: "541-321-5115",
    email: "not-an-email",
    city: "Sweet Home",
    zipCode: "97386",
    serviceType: "inspection-repairs",
    message: "Need help closing out two inspection items before sale.",
    urgency: "soon",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /email/i);
});

test("POST /api/leads rejects clearly invalid phone numbers with the standard ApiError contract", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/leads", {
    name: "Test User",
    phone: "abc",
    email: "office@bensonhomesolutions.com",
    city: "Sweet Home",
    zipCode: "97386",
    serviceType: "inspection-repairs",
    message: "Need help closing out two inspection items before sale.",
    urgency: "soon",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /phone/i);
});

test("POST /api/leads rejects overlong messages with the standard ApiError contract", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/leads", {
    name: "Test User",
    phone: "541-321-5115",
    email: "office@bensonhomesolutions.com",
    city: "Sweet Home",
    zipCode: "97386",
    serviceType: "inspection-repairs",
    message: "x".repeat(2001),
    urgency: "soon",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /message/i);
});

test("POST /api/leads rejects clearly invalid zip codes with the standard ApiError contract", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/leads", {
    name: "Test User",
    phone: "541-321-5115",
    email: "office@bensonhomesolutions.com",
    address: "123 Main St",
    city: "Sweet Home",
    zipCode: "97",
    serviceType: "inspection-repairs",
    message: "Need help closing out two inspection items before sale.",
    urgency: "soon",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /zip/i);
});

test("POST /api/leads rejects overlong city values with the standard ApiError contract", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/leads", {
    name: "Test User",
    phone: "541-321-5115",
    email: "office@bensonhomesolutions.com",
    city: "S".repeat(121),
    zipCode: "97386",
    serviceType: "inspection-repairs",
    message: "Need help closing out two inspection items before sale.",
    urgency: "soon",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /city/i);
});

test("POST /api/leads rejects overlong address values with the standard ApiError contract", async () => {
  const server = createServer();
  const { response, json } = await postJson(server, "/api/leads", {
    name: "Test User",
    phone: "541-321-5115",
    email: "office@bensonhomesolutions.com",
    address: "1".repeat(241),
    city: "Sweet Home",
    zipCode: "97386",
    serviceType: "inspection-repairs",
    message: "Need help closing out two inspection items before sale.",
    urgency: "soon",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /address/i);
});

test("submitLeadRequest stores normalized string fields after sanitization", async () => {
  const beforeCount = getLeadStoreSnapshot().length;

  await submitLeadRequest({
    name: "  Test   User  ",
    phone: " 541-321-5115 ",
    email: " office@bensonhomesolutions.com ",
    city: " Sweet   Home ",
    zipCode: " 97386 ",
    serviceType: "inspection-repairs",
    message: "  Need <urgent> help   before closing. ",
    urgency: "soon",
    sourcePage: " /services/inspection-repairs ",
  });

  const snapshot = getLeadStoreSnapshot();
  const storedLead = snapshot.at(-1);

  assert.equal(snapshot.length, beforeCount + 1);
  assert.equal(storedLead.name, "Test User");
  assert.equal(storedLead.phone, "541-321-5115");
  assert.equal(storedLead.email, "office@bensonhomesolutions.com");
  assert.equal(storedLead.city, "Sweet Home");
  assert.equal(storedLead.zipCode, "97386");
  assert.equal(storedLead.message, "Need urgent help before closing.");
  assert.equal(storedLead.sourcePage, "/services/inspection-repairs");
});

test("POST /api/leads includes access-control-allow-origin for allowed origins", async () => {
  const previousFrontendOrigin = process.env.FRONTEND_ORIGIN;
  process.env.FRONTEND_ORIGIN = "https://bensonhomesolutions.com";

  try {
    const server = createServer();
    const { response } = await postJson(server, "/api/leads", {
      name: "Test User",
      phone: "541-321-5115",
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
        phone: "541-321-5115",
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
        phone: "541-321-5115",
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
