import { randomUUID } from "node:crypto";

import { ApiError } from "../lib/errors.js";
import {
  getLeadCashStore,
  getLeadCashStoreHealth,
  getLeadCashWorkflowSnapshots,
} from "../lib/lead-cash-store.js";
import {
  normalizeProviderIds,
  summarizeLeadCashWorkflow,
} from "../lib/lead-cash-state.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeWorkflowId(value) {
  return String(value ?? "").trim();
}

function buildEventKey(workflowId, eventType, providerEventId) {
  return providerEventId || `${workflowId}:${eventType}:${randomUUID()}`;
}

function buildLeadIntakeMetadata(submission, extra = {}) {
  return {
    submissionKind: submission.submissionKind,
    name: submission.name,
    serviceType: submission.serviceType,
    urgency: submission.urgency,
    sourcePage: submission.sourcePage ?? null,
    ...extra,
  };
}

async function safeStoreCall(handler) {
  try {
    return await handler();
  } catch {
    return null;
  }
}

export function createLeadCashPipeline({ store = getLeadCashStore() } = {}) {
  return {
    async recordLeadIntake({
      leadId,
      sourceKind = "website",
      submission,
      providerIds = {},
      occurredAt = new Date().toISOString(),
      metadata = {},
    }) {
      const workflowId = normalizeWorkflowId(leadId);
      if (!workflowId) {
        throw new ApiError(400, "VALIDATION_ERROR", "Lead-cash workflows require a leadId.");
      }

      const workflow = await store.createWorkflow({
        id: workflowId,
        sourceKind,
        createdAt: occurredAt,
        metadata: buildLeadIntakeMetadata(submission ?? {}, metadata),
        providerIds: normalizeProviderIds(providerIds),
      });

      const event = await store.appendEvent(workflow.id, {
        eventKey: `lead:${workflowId}`,
        eventType: "lead.intake.received",
        provider: sourceKind,
        occurredAt,
        payload: {
          submission: submission ?? {},
        },
        providerIds,
      });

      return event.workflow;
    },
    async advanceWorkflow({
      workflowId,
      eventType,
      provider = null,
      providerEventId = null,
      providerIds = {},
      targetState = null,
      payload = {},
      occurredAt = new Date().toISOString(),
      eventKey = null,
    }) {
      const id = normalizeWorkflowId(workflowId);
      if (!id) {
        throw new ApiError(400, "VALIDATION_ERROR", "workflowId is required.");
      }

      const existing = await store.getWorkflow(id);
      if (!existing) {
        throw new ApiError(404, "NOT_FOUND", `Workflow ${id} was not found.`);
      }

      return store.appendEvent(id, {
        eventKey: eventKey ?? buildEventKey(id, eventType, providerEventId),
        eventType,
        provider,
        providerEventId,
        targetState,
        occurredAt,
        payload: isPlainObject(payload) ? payload : {},
        providerIds,
      });
    },
    async handleWebhook(payload) {
      if (!isPlainObject(payload)) {
        throw new ApiError(400, "VALIDATION_ERROR", "Webhook payload must be a JSON object.");
      }

      return this.advanceWorkflow({
        workflowId: payload.workflowId ?? payload.leadId ?? payload.id,
        eventType: payload.eventType ?? payload.type,
        provider: payload.provider ?? null,
        providerEventId: payload.providerEventId ?? payload.eventId ?? null,
        providerIds: payload.providerIds ?? {},
        targetState: payload.targetState ?? null,
        payload: payload.payload ?? payload.data ?? payload,
        occurredAt: payload.occurredAt ?? new Date().toISOString(),
        eventKey: payload.eventKey ?? null,
      });
    },
    async reconcileWorkflows({ max = 25 } = {}) {
      const workflows = await store.listWorkflows();
      return workflows
        .filter((workflow) => workflow.state !== "qb_synced")
        .slice(0, max)
        .map(summarizeLeadCashWorkflow);
    },
    async sendReminder(workflowId, payload = {}) {
      const workflow = await store.getWorkflow(workflowId);
      if (!workflow) {
        throw new ApiError(404, "NOT_FOUND", `Workflow ${workflowId} was not found.`);
      }

      return this.advanceWorkflow({
        workflowId,
        eventType: "reminder.sent",
        provider: "cron",
        targetState: workflow.state,
        payload,
      });
    },
    async rerunDurableJobs(workflowId, payload = {}) {
      return this.advanceWorkflow({
        workflowId,
        eventType: "quickbooks.invoice.synced",
        provider: "cron",
        targetState: "qb_synced",
        payload,
      });
    },
    async getWorkflow(workflowId) {
      return store.getWorkflow(workflowId);
    },
    async listWorkflows() {
      return store.listWorkflows();
    },
    async health() {
      return getLeadCashStoreHealth();
    },
    snapshot() {
      return getLeadCashWorkflowSnapshots();
    },
  };
}

export const leadCashPipeline = createLeadCashPipeline();

export async function recordLeadCashIntake(args) {
  return safeStoreCall(() => leadCashPipeline.recordLeadIntake(args));
}

export async function handleLeadCashWebhook(payload) {
  return leadCashPipeline.handleWebhook(payload);
}

export async function getLeadCashWorkflowSnapshot(workflowId) {
  return leadCashPipeline.getWorkflow(workflowId);
}

export async function getLeadCashPipelineHealth() {
  return leadCashPipeline.health();
}
