import { ApiError } from "../lib/errors.js";
import { getSubmissionSnapshots } from "../lib/submission-store.js";
import { createSubmissionWorkflow } from "./intake-workflow.js";
import { validateLeadRequest } from "./submission-validation.js";

const turnstileVerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstileToken(token) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    return;
  }

  if (!token) {
    throw new ApiError(400, "VALIDATION_ERROR", "Security check is required before sending this request.");
  }

  let response;

  try {
    response = await fetch(turnstileVerifyUrl, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });
  } catch {
    throw new ApiError(503, "CAPTCHA_UNAVAILABLE", "Security check could not be verified right now.");
  }

  if (!response.ok) {
    throw new ApiError(503, "CAPTCHA_UNAVAILABLE", "Security check could not be verified right now.");
  }

  const result = await response.json().catch(() => null);

  if (!result || result.success !== true) {
    throw new ApiError(400, "CAPTCHA_ERROR", "Security check failed. Please refresh and try again.");
  }
}

function buildLeadEmail(submission) {
  return {
    subject: `Lead request: ${submission.name} - ${submission.serviceType}`,
    title: "New lead request",
  };
}

export function createLeadSubmissionService(overrides = {}) {
  return createSubmissionWorkflow({
    submissionKind: "lead",
    successMessage: "Lead request received. Benson Home Solutions will review and follow up.",
    validatePayload: validateLeadRequest,
    buildEmail: buildLeadEmail,
    verifyToken: overrides.verifyToken ?? verifyTurnstileToken,
    getStore: overrides.getStore,
    sendEmail: overrides.sendEmail,
  });
}

export const submitLeadRequest = createLeadSubmissionService();

export function getLeadStoreSnapshot() {
  return getSubmissionSnapshots("lead");
}
