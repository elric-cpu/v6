import { getSubmissionSnapshots } from "../lib/submission-store.js";
import { createSubmissionWorkflow } from "./intake-workflow.js";
import { validateEmergencyRequest } from "./submission-validation.js";

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
