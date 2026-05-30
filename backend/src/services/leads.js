import { ApiError } from "../lib/errors.js";
import { getSubmissionSnapshots } from "../lib/submission-store.js";
import { createSubmissionWorkflow } from "./intake-workflow.js";

const validServiceTypes = new Set([
  "inspection-repairs",
  "water-mold-moisture",
  "window-door-replacements",
  "maintenance-plans",
  "emergency-response",
  "energy-weatherization",
  "property-preservation",
  "residential-remodeling",
  "commercial-maintenance",
  "church-nonprofit-maintenance",
]);

const validUrgencies = new Set(["standard", "soon", "emergency"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{7,20}$/;
const zipCodePattern = /^\d{5}(?:-\d{4})?$/;
const maxMessageLength = 2000;
const maxCityLength = 120;
const maxAddressLength = 240;
const turnstileVerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function validateLeadRequest(payload) {
  const missingFields = [];

  if (!payload.name) missingFields.push("name");
  if (!payload.phone) missingFields.push("phone");
  if (!payload.serviceType) missingFields.push("serviceType");
  if (!payload.message) missingFields.push("message");
  if (!payload.urgency) missingFields.push("urgency");

  if (missingFields.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Lead request is missing required fields.", {
      fields: missingFields,
    });
  }

  if (!validServiceTypes.has(payload.serviceType)) {
    throw new ApiError(400, "VALIDATION_ERROR", "serviceType is invalid.");
  }

  if (!validUrgencies.has(payload.urgency)) {
    throw new ApiError(400, "VALIDATION_ERROR", "urgency must be standard, soon, or emergency.");
  }

  if (payload.email && !emailPattern.test(payload.email)) {
    throw new ApiError(400, "VALIDATION_ERROR", "email must be a valid email address.");
  }

  if (!phonePattern.test(payload.phone)) {
    throw new ApiError(400, "VALIDATION_ERROR", "phone must be a valid phone number.");
  }

  if (payload.message.length > maxMessageLength) {
    throw new ApiError(400, "VALIDATION_ERROR", `message must be ${maxMessageLength} characters or fewer.`);
  }

  if (payload.zipCode && !zipCodePattern.test(payload.zipCode)) {
    throw new ApiError(400, "VALIDATION_ERROR", "zipCode must be a valid ZIP code.");
  }

  if (payload.city && payload.city.length > maxCityLength) {
    throw new ApiError(400, "VALIDATION_ERROR", `city must be ${maxCityLength} characters or fewer.`);
  }

  if (payload.address && payload.address.length > maxAddressLength) {
    throw new ApiError(400, "VALIDATION_ERROR", `address must be ${maxAddressLength} characters or fewer.`);
  }
}

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
