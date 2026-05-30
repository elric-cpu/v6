import { ApiError } from "../lib/errors.js";

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

function requireFields(payload, fields, message) {
  const missingFields = fields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", message, {
      fields: missingFields,
    });
  }
}

function validateCommonFields(payload, { requireUrgency = false, requestLabel = "Lead request" } = {}) {
  requireFields(
    payload,
    ["name", "phone", "serviceType", "message", ...(requireUrgency ? ["urgency"] : [])],
    `${requestLabel} is missing required fields.`,
  );

  if (!validServiceTypes.has(payload.serviceType)) {
    throw new ApiError(400, "VALIDATION_ERROR", "serviceType is invalid.");
  }

  if (!phonePattern.test(payload.phone)) {
    throw new ApiError(400, "VALIDATION_ERROR", "phone must be a valid phone number.");
  }

  if (payload.email && !emailPattern.test(payload.email)) {
    throw new ApiError(400, "VALIDATION_ERROR", "email must be a valid email address.");
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

export function validateLeadRequest(payload) {
  validateCommonFields(payload);

  if (!validUrgencies.has(payload.urgency)) {
    throw new ApiError(400, "VALIDATION_ERROR", "urgency must be standard, soon, or emergency.");
  }
}

export function validateEmergencyRequest(payload) {
  validateCommonFields(payload, { requireUrgency: true, requestLabel: "Emergency request" });

  if (payload.urgency !== "emergency") {
    throw new ApiError(400, "VALIDATION_ERROR", "Emergency requests must have urgency set to 'emergency'.");
  }
}
