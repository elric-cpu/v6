import test from "node:test";
import assert from "node:assert/strict";

import { ApiError } from "../src/lib/errors.js";
import { createPostgresStoreForTests } from "../src/lib/submission-store.js";

function makeSubmission(overrides = {}) {
  return {
    id: "lead-123",
    submissionKind: "lead",
    name: "Test User",
    phone: "458-723-0818",
    email: "office@bensonhomesolutions.com",
    address: "123 Main St",
    city: "Burns",
    zipCode: "97720",
    serviceType: "inspection-repairs",
    message: "Need help closing out an inspection repair.",
    urgency: "soon",
    sourcePage: "/contact",
    createdAt: "2026-05-30T00:00:00.000Z",
    ...overrides,
  };
}

test("postgres store retries schema initialization after a transient bootstrap failure", async () => {
  let schemaAttempts = 0;

  const pool = {
    async query(sql) {
      if (sql.includes("CREATE TABLE IF NOT EXISTS intake_submissions")) {
        schemaAttempts += 1;

        if (schemaAttempts === 1) {
          throw new Error("temporary postgres startup failure");
        }

        return { rowCount: 0 };
      }

      if (sql.includes("INSERT INTO intake_submissions")) {
        return { rowCount: 1 };
      }

      throw new Error(`Unexpected SQL: ${sql}`);
    },
    async end() {},
  };

  const store = createPostgresStoreForTests("postgresql://example", () => pool);
  const submission = makeSubmission();

  await assert.rejects(
    store.createSubmission(submission),
    (error) => error instanceof ApiError && error.statusCode === 503 && error.code === "DATABASE_UNAVAILABLE",
  );

  const stored = await store.createSubmission(submission);

  assert.deepEqual(stored, submission);
  assert.equal(schemaAttempts, 2);
});

test("postgres store rejects delivery updates when no row is updated", async () => {
  let updateAttempts = 0;

  const pool = {
    async query(sql) {
      if (sql.includes("CREATE TABLE IF NOT EXISTS intake_submissions")) {
        return { rowCount: 0 };
      }

      if (sql.includes("UPDATE intake_submissions")) {
        updateAttempts += 1;
        return { rowCount: 0 };
      }

      throw new Error(`Unexpected SQL: ${sql}`);
    },
    async end() {},
  };

  const store = createPostgresStoreForTests("postgresql://example", () => pool);

  await assert.rejects(
    store.updateDelivery("missing-submission", {
      delivered: true,
      reason: null,
      provider: "resend",
      messageId: "email-123",
      deliveredAt: "2026-05-30T00:00:00.000Z",
      email: {
        delivered: true,
        reason: null,
        provider: "resend",
        messageId: "email-123",
        deliveredAt: "2026-05-30T00:00:00.000Z",
      },
      sms: {
        delivered: true,
        reason: null,
        provider: "twilio",
        messageId: "sms-123",
        deliveredAt: "2026-05-30T00:00:00.000Z",
      },
    }),
    (error) => error instanceof ApiError && error.statusCode === 404 && error.code === "NOT_FOUND",
  );

  assert.equal(updateAttempts, 1);
});
