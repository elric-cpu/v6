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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{7,20}$/;
const zipCodePattern = /^\d{5}(?:-\d{4})?$/;
const maxMessageLength = 2000;
const maxCityLength = 120;
const maxAddressLength = 240;

function validateEmergencyRequest(payload) {
  const missingFields = [];

  if (!payload.name) missingFields.push("name");
  if (!payload.phone) missingFields.push("phone");
  if (!payload.serviceType) missingFields.push("serviceType");
  if (!payload.message) missingFields.push("message");

  if (missingFields.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Emergency request is missing required fields.", {
      fields: missingFields,
    });
  }

  if (!validServiceTypes.has(payload.serviceType)) {
    throw new ApiError(400, "VALIDATION_ERROR", "serviceType is invalid.");
  }

  if (payload.urgency !== "emergency") {
    throw new ApiError(400, "VALIDATION_ERROR", "Emergency requests must have urgency set to 'emergency'.");
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

function buildEmergencyEmail(submission) {
  return {
    subject: `Emergency request: ${submission.name} - ${submission.serviceType}`,
    title: "New emergency request",
  };
}

export function createEmergencySubmissionService(overrides = {}) {
  return createSubmissionWorkflow({
    submissionKind: "emergency",
    successMessage: "Emergency request received. Benson Home Solutions will review the active condition, access notes, location, and route timing.",
    validatePayload: validateEmergencyRequest,
    buildEmail: buildEmergencyEmail,
    verifyToken: overrides.verifyToken,
    getStore: overrides.getStore,
    sendEmail: overrides.sendEmail,
  });
}

export const submitEmergencyRequest = createEmergencySubmissionService();

export function getEmergencyStoreSnapshot() {
  return getSubmissionSnapshots("emergency");
}
