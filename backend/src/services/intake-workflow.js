import { randomUUID } from "node:crypto";

import { ApiError } from "../lib/errors.js";
import { sanitizeObject } from "../lib/sanitize.js";
import { getSubmissionStore } from "../lib/submission-store.js";
import { sendSubmissionEmail } from "../lib/resend-mailer.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function defaultVerifyToken() {}

export function createSubmissionWorkflow({
  submissionKind,
  successMessage,
  validatePayload,
  buildEmail,
  verifyToken = defaultVerifyToken,
  getStore = getSubmissionStore,
  sendEmail = sendSubmissionEmail,
}) {
  return async function submitSubmission(rawPayload) {
    if (!isPlainObject(rawPayload)) {
      throw new ApiError(400, "VALIDATION_ERROR", `${submissionKind} request payload must be a JSON object.`);
    }

    const payload = sanitizeObject(rawPayload);
    validatePayload(payload);
    await verifyToken(payload.turnstileToken);

    const { turnstileToken: _turnstileToken, ...submissionFields } = payload;
    const submission = {
      id: randomUUID(),
      submissionKind,
      ...submissionFields,
      createdAt: new Date().toISOString(),
    };

    const store = getStore();
    try {
      await store.createSubmission(submission);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 503) {
        throw error;
      }

      throw new ApiError(503, "DATABASE_UNAVAILABLE", "Durable submission storage is unavailable.");
    }

    let delivery = { delivered: false, reason: "email_not_configured" };

    try {
      delivery = await sendEmail({
        submission,
        ...buildEmail(submission),
      });
    } catch {
      delivery = { delivered: false, reason: "email_delivery_failed" };
    }

    try {
      await store.updateDelivery(submission.id, {
        ...delivery,
        deliveredAt: delivery.delivered ? new Date().toISOString() : null,
      });
    } catch {
      // The submission is already durably stored. Keep the request response stable.
    }

    return {
      success: true,
      leadId: submission.id,
      message: successMessage,
      createdAt: submission.createdAt,
      delivery: {
        delivered: delivery.delivered,
        ...(delivery.reason ? { reason: delivery.reason } : {}),
      },
    };
  };
}
