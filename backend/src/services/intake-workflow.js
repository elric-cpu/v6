import { randomUUID } from "node:crypto";

import { ApiError } from "../lib/errors.js";
import { sanitizeObject } from "../lib/sanitize.js";
import { getSubmissionStore } from "../lib/submission-store.js";
import { sendSubmissionEmail } from "../lib/resend-mailer.js";
import { sendSubmissionSms } from "../lib/twilio-sms.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function defaultVerifyToken() {}

async function resolveNotification(sendNotification, payload, fallbackReason) {
  try {
    const result = await sendNotification(payload);

    if (!result || typeof result !== "object") {
      return {
        delivered: false,
        reason: fallbackReason,
        provider: null,
        messageId: null,
      };
    }

    return {
      delivered: Boolean(result.delivered),
      reason: result.delivered ? null : result.reason ?? fallbackReason,
      provider: result.provider ?? null,
      messageId: result.messageId ?? null,
    };
  } catch {
    return {
      delivered: false,
      reason: fallbackReason,
      provider: null,
      messageId: null,
    };
  }
}

export function createSubmissionWorkflow({
  submissionKind,
  successMessage,
  validatePayload,
  buildEmail,
  verifyToken = defaultVerifyToken,
  getStore = getSubmissionStore,
  sendEmail = sendSubmissionEmail,
  sendSms = sendSubmissionSms,
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

    const notificationPayload = {
      submission,
      ...buildEmail(submission),
    };

    const [emailDelivery, smsDelivery] = await Promise.all([
      resolveNotification(sendEmail, notificationPayload, "email_delivery_failed"),
      resolveNotification(sendSms, notificationPayload, "sms_delivery_failed"),
    ]);

    const delivered = emailDelivery.delivered && smsDelivery.delivered;
    const reason = emailDelivery.delivered ? smsDelivery.reason : emailDelivery.reason;
    const deliveredAt = delivered ? new Date().toISOString() : null;

    try {
      await store.updateDelivery(submission.id, {
        delivered,
        reason,
        deliveredAt,
        provider: emailDelivery.provider ?? smsDelivery.provider ?? null,
        messageId: emailDelivery.messageId ?? smsDelivery.messageId ?? null,
        email: emailDelivery,
        sms: smsDelivery,
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
        delivered,
        ...(reason ? { reason } : {}),
      },
    };
  };
}
