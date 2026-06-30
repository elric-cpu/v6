import test from "node:test";
import assert from "node:assert/strict";

import { createResendMailer, getEmailHealthStatus } from "../src/lib/resend-mailer.js";
import { getSmsHealthStatus } from "../src/lib/twilio-sms.js";
import { withEnv } from "../test-support/env.js";

test("createResendMailer sends a Resend message", async () => {
  await withEnv(
    {
      EMAIL_FROM: "office@bensonhomesolutions.com",
      EMAIL_TO: "office@bensonhomesolutions.com",
      EMAIL_API_KEY: "resend-test-key",
    },
    async () => {
      const calls = [];
      const mailer = createResendMailer({
        fetchImpl: async (input, init) => {
          const url = typeof input === "string" ? input : input.url;
          calls.push({
            type: "fetch",
            url,
            init,
          });

          if (url === "https://api.resend.com/emails") {
            return new Response(JSON.stringify({ id: "email-123" }), {
              status: 200,
              headers: {
                "content-type": "application/json",
              },
            });
          }

          throw new Error(`Unexpected fetch url: ${url}`);
        },
      });

      const result = await mailer({
        submission: {
          id: "lead-123",
          name: "Test User",
          phone: "458-723-0818",
          email: "customer@example.com",
          serviceType: "inspection-repairs",
          urgency: "soon",
          city: "Burns",
          zipCode: "97720",
          message: "Need help closing out an inspection repair.",
          sourcePage: "/services/inspection-repairs",
        },
        subject: "New lead from website",
        title: "Website Lead",
      });

      assert.deepEqual(result, {
        delivered: true,
        provider: "resend",
        messageId: "email-123",
      });
      assert.equal(calls[0].url, "https://api.resend.com/emails");
      assert.equal(calls[0].init.headers.authorization, "Bearer resend-test-key");
      assert.equal(JSON.parse(calls[0].init.body).to[0], "office@bensonhomesolutions.com");
    },
  );
});

test("getEmailHealthStatus reports resend as healthy when the env is configured", async () => {
  await withEnv(
    {
      EMAIL_FROM: "office@bensonhomesolutions.com",
      EMAIL_TO: "office@bensonhomesolutions.com",
      EMAIL_API_KEY: "resend-test-key",
    },
    async () => {
      const status = getEmailHealthStatus();

      assert.equal(status.status, "healthy");
      assert.equal(status.provider, "resend");
    },
  );
});

test("getSmsHealthStatus reports twilio as healthy when the env is configured", async () => {
  await withEnv(
    {
      TWILIO_ACCOUNT_SID: "AC1234567890",
      TWILIO_AUTH_TOKEN: "twilio-test-token",
      TWILIO_FROM_NUMBER: "+15413215115",
      SMS_TO: "+15414130480",
    },
    async () => {
      const status = getSmsHealthStatus();

      assert.equal(status.status, "healthy");
      assert.equal(status.provider, "twilio");
    },
  );
});
