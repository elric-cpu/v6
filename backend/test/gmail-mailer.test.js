import test from "node:test";
import assert from "node:assert/strict";

import { createGmailMailer, getEmailHealthStatus } from "../src/lib/resend-mailer.js";

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
    });
}

test("createGmailMailer signs a delegated JWT and sends a Gmail message", async () => {
  await withEnv(
    {
      EMAIL_FROM: "office@bensonhomesolutions.com",
      GMAIL_SERVICE_ACCOUNT_EMAIL: "backend-core-sa@civic-wall-494004-b3.iam.gserviceaccount.com",
      GMAIL_IMPERSONATED_USER: "office@bensonhomesolutions.com",
      LEAD_NOTIFICATION_TO: "office@bensonhomesolutions.com",
    },
    async () => {
      const calls = [];
      const mailer = createGmailMailer({
        credentialsClient: {
          async signJwt(request) {
            calls.push({
              type: "signJwt",
              request,
            });

            return [{ signedJwt: "signed-jwt-token" }];
          },
        },
        fetchImpl: async (input, init) => {
          const url = typeof input === "string" ? input : input.url;
          calls.push({
            type: "fetch",
            url,
            init,
          });

          if (url === "https://oauth2.googleapis.com/token") {
            return new Response(JSON.stringify({ access_token: "access-token" }), {
              status: 200,
              headers: {
                "content-type": "application/json",
              },
            });
          }

          if (url === "https://gmail.googleapis.com/gmail/v1/users/me/messages/send") {
            return new Response(JSON.stringify({ id: "gmail-message-123" }), {
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
          phone: "541-321-5115",
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
        provider: "gmail",
        messageId: "gmail-message-123",
      });
      assert.equal(calls[0].type, "signJwt");
      assert.equal(calls[0].request.name, "projects/-/serviceAccounts/backend-core-sa@civic-wall-494004-b3.iam.gserviceaccount.com");
      assert.equal(typeof calls[0].request.payload, "string");
      assert.equal(calls[1].url, "https://oauth2.googleapis.com/token");
      assert.equal(calls[2].url, "https://gmail.googleapis.com/gmail/v1/users/me/messages/send");
      assert.equal(calls[2].init.headers.authorization, "Bearer access-token");
      assert.equal(JSON.parse(calls[2].init.body).raw.length > 0, true);
    },
  );
});

test("getEmailHealthStatus reports gmail as healthy when the workspace env is configured", async () => {
  await withEnv(
    {
      EMAIL_FROM: "office@bensonhomesolutions.com",
      GMAIL_SERVICE_ACCOUNT_EMAIL: "backend-core-sa@civic-wall-494004-b3.iam.gserviceaccount.com",
      GMAIL_IMPERSONATED_USER: "office@bensonhomesolutions.com",
      LEAD_NOTIFICATION_TO: "office@bensonhomesolutions.com",
    },
    async () => {
      const status = getEmailHealthStatus();

      assert.equal(status.status, "healthy");
      assert.equal(status.provider, "gmail");
    },
  );
});
