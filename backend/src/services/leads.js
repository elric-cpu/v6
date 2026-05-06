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

const validUrgencies = new Set(["standard", "soon", "emergency"]);
const leadStore = [];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{7,20}$/;
const zipCodePattern = /^\d{5}(?:-\d{4})?$/;
const maxMessageLength = 2000;
const maxCityLength = 120;
const maxAddressLength = 240;

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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

async function notifyLead(lead) {
  if (!process.env.EMAIL_API_KEY || !process.env.EMAIL_FROM) {
    return { delivered: false, reason: "email_not_configured" };
  }

  return { delivered: true, leadId: lead.id };
}

export async function submitLeadRequest(rawPayload) {
  if (!isPlainObject(rawPayload)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Lead request payload must be a JSON object.");
  }

  const payload = sanitizeObject(rawPayload);
  validateLeadRequest(payload);

  const lead = {
    id: randomUUID(),
    ...payload,
    createdAt: new Date().toISOString(),
  };

  leadStore.push(lead);
  const delivery = await notifyLead(lead);

  return {
    success: true,
    leadId: lead.id,
    message: "Lead request received. Benson Home Solutions will review and follow up.",
    createdAt: lead.createdAt,
    delivery: {
      delivered: delivery.delivered,
      ...(delivery.reason ? { reason: delivery.reason } : {}),
    },
  };
}

export function getLeadStoreSnapshot() {
  return leadStore.slice();
}
