import { randomUUID } from "node:crypto";

import { ApiError } from "../lib/errors.js";
import { sanitizeObject } from "../lib/sanitize.js";

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

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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

async function notifyEmergencyRequest(emergency) {
  if (!process.env.EMAIL_API_KEY || !process.env.EMAIL_FROM) {
    return { delivered: false, reason: "email_not_configured" };
  }

  return { delivered: true, emergencyId: emergency.id };
}

export async function submitEmergencyRequest(rawPayload) {
  if (!isPlainObject(rawPayload)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Emergency request payload must be a JSON object.");
  }

  const payload = sanitizeObject(rawPayload);
  validateEmergencyRequest(payload);

  const emergency = {
    id: randomUUID(),
    ...payload,
    createdAt: new Date().toISOString(),
  };

  // In-memory store; TODO: move to Postgres
  emergencyStore.push(emergency);
  const delivery = await notifyEmergencyRequest(emergency);

  return {
    success: true,
    leadId: emergency.id,
    message: "Emergency request received. Benson Home Solutions will review the active condition, access notes, location, and route timing.",
    createdAt: emergency.createdAt,
    delivery: {
      delivered: delivery.delivered,
      ...(delivery.reason ? { reason: delivery.reason } : {}),
    },
  };
}

const emergencyStore = [];

export function getEmergencyStoreSnapshot() {
  return emergencyStore.slice();
}
