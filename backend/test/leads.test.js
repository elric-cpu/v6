import test from "node:test";
import assert from "node:assert/strict";

import { createServer } from "../src/app.js";
import { getLeadStoreSnapshot, submitLeadRequest } from "../src/services/leads.js";
import { resetSubmissionStoreForTests } from "../src/lib/submission-store.js";
import {
  mockResendFetch,
  mockTurnstileFetch,
  mockTwilioFetch,
  postJson,
  withMockedFetch,
} from "../test-support/submission.js";

process.env.TURNSTILE_SECRET_KEY = "";

test.beforeEach(() => {
  resetSubmissionStoreForTests();
});

test("POST /api/leads accepts a valid lead and returns a stable lead id", async () => {
  await withMockedFetch(
    [
      mockResendFetch({ status: 200, body: { id: "email-123" } }),
      mockTwilioFetch({ status: 201, body: { sid: "sms-123" } }),
    ],
    async () => {
      const previousEnv = {
        EMAIL_API_KEY: process.env.EMAIL_API_KEY,
        EMAIL_FROM: process.env.EMAIL_FROM,
        EMAIL_TO: process.env.EMAIL_TO,
        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
        TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER,
        SMS_TO: process.env.SMS_TO,
      };

      process.env.EMAIL_API_KEY = "resend-test-key";
      process.env.EMAIL_FROM = "Benson Home Solutions <office@bensonhomesolutions.com>";
      process.env.EMAIL_TO = "office@bensonhomesolutions.com";
      process.env.TWILIO_ACCOUNT_SID = "AC1234567890";
      process.env.TWILIO_AUTH_TOKEN = "twilio-test-token";
      process.env.TWILIO_FROM_NUMBER = "+15413215115";
      process.env.SMS_TO = "+15414130480";

      try {
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
        assert.equal(json.success, true);
        assert.equal(json.delivery.delivered, true);
        assert.match(json.leadId, /^[0-9a-f-]{36}$/);
        assert.match(json.message, /received/i);
        assert.match(json.createdAt, /\d{4}-\d{2}-\d{2}T/);
        assert.equal(typeof json.delivery.delivered, "boolean");
        assert.equal(typeof json.delivery, "object");
        assert.equal(Array.isArray(json.delivery), false);
        assert.equal("leadId" in json.delivery, false);
        assert.equal("lead" in json, false);
      } finally {
        process.env.EMAIL_API_KEY = previousEnv.EMAIL_API_KEY;
        process.env.EMAIL_FROM = previousEnv.EMAIL_FROM;
        process.env.EMAIL_TO = previousEnv.EMAIL_TO;
        process.env.TWILIO_ACCOUNT_SID = previousEnv.TWILIO_ACCOUNT_SID;
        process.env.TWILIO_AUTH_TOKEN = previousEnv.TWILIO_AUTH_TOKEN;
        process.env.TWILIO_FROM_NUMBER = previousEnv.TWILIO_FROM_NUMBER;
        process.env.SMS_TO = previousEnv.SMS_TO;
      }
    },
  );
});

test("POST /api/leads verifies a Turnstile token when the secret is configured", async () => {
  const previousSecret = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = "test-secret";

  try {
    await withMockedFetch(
      [mockTurnstileFetch, mockResendFetch({ status: 200, body: { id: "email-123" } }), mockTwilioFetch({ status: 201, body: { sid: "sms-123" } })],
      async () => {
        process.env.EMAIL_API_KEY = "resend-test-key";
        process.env.EMAIL_FROM = "Benson Home Solutions <office@bensonhomesolutions.com>";
        process.env.EMAIL_TO = "office@bensonhomesolutions.com";
        process.env.TWILIO_ACCOUNT_SID = "AC1234567890";
        process.env.TWILIO_AUTH_TOKEN = "twilio-test-token";
        process.env.TWILIO_FROM_NUMBER = "+15413215115";
        process.env.SMS_TO = "+15414130480";

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
        turnstileToken: "turnstile-token",
      });

      assert.equal(response.status, 201);
      assert.equal(json.success, true);
      assert.match(json.leadId, /^[0-9a-f-]{36}$/);
      },
    );
  } finally {
    process.env.TURNSTILE_SECRET_KEY = previousSecret;
  }
});

test("POST /api/leads rejects requests without a Turnstile token when the secret is configured", async () => {
  const previousSecret = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = "test-secret";

  try {
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

    assert.equal(response.status, 400);
    assert.equal(json.error.code, "VALIDATION_ERROR");
    assert.match(json.error.message, /security check/i);
  } finally {
    process.env.TURNSTILE_SECRET_KEY = previousSecret;
  }
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
    phone: "458-723-0818",
    email: "not-an-email",
    city: "Burns",
    zipCode: "97720",
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
    city: "Burns",
    zipCode: "97720",
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
    phone: "458-723-0818",
    email: "office@bensonhomesolutions.com",
    city: "Burns",
    zipCode: "97720",
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
    phone: "458-723-0818",
    email: "office@bensonhomesolutions.com",
    address: "123 Main St",
    city: "Burns",
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
    phone: "458-723-0818",
    email: "office@bensonhomesolutions.com",
    city: "S".repeat(121),
    zipCode: "97720",
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
    phone: "458-723-0818",
    email: "office@bensonhomesolutions.com",
    address: "1".repeat(241),
    city: "Burns",
    zipCode: "97720",
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
    phone: " (458) 723-0818 ",
    email: " office@bensonhomesolutions.com ",
    city: " Burns ",
    zipCode: " 97720 ",
    serviceType: "inspection-repairs",
    message: "  Need <urgent> help   before closing. ",
    urgency: "soon",
    sourcePage: " /services/inspection-repairs ",
  });

  const snapshot = getLeadStoreSnapshot();
  const storedLead = snapshot.at(-1);

  assert.equal(snapshot.length, beforeCount + 1);
  assert.equal(storedLead.name, "Test User");
  assert.equal(storedLead.phone, "(458) 723-0818");
  assert.equal(storedLead.email, "office@bensonhomesolutions.com");
  assert.equal(storedLead.city, "Burns");
  assert.equal(storedLead.zipCode, "97720");
  assert.equal(storedLead.message, "Need urgent help before closing.");
  assert.equal(storedLead.sourcePage, "/services/inspection-repairs");
});
