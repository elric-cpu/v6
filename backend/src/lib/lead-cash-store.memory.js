import { ApiError } from "./errors.js";
import {
  applyLeadCashEvent,
  cloneLeadCashWorkflow,
  createLeadCashWorkflow,
  summarizeLeadCashWorkflow,
} from "./lead-cash-state.js";

function storageUnavailableError(message = "Lead-to-cash storage is not configured.") {
  return new ApiError(503, "DATABASE_UNAVAILABLE", message);
}

function cloneRecord(record) {
  return record == null ? record : JSON.parse(JSON.stringify(record));
}

export function createMemoryLeadCashStore() {
  const workflows = new Map();

  return {
    async createWorkflow(record) {
      if (!record?.id) {
        throw new ApiError(400, "VALIDATION_ERROR", "Lead-cash workflows require an id.");
      }

      const stored = workflows.get(record.id);
      if (stored) {
        return cloneLeadCashWorkflow(stored);
      }

      const workflow = createLeadCashWorkflow(record);
      workflows.set(workflow.id, workflow);
      return cloneLeadCashWorkflow(workflow);
    },
    async appendEvent(workflowId, eventInput) {
      const workflow = workflows.get(workflowId);
      if (!workflow) {
        throw new ApiError(404, "NOT_FOUND", `Workflow ${workflowId} was not found.`);
      }

      const result = applyLeadCashEvent(workflow, eventInput);
      workflows.set(workflowId, result.workflow);
      return {
        ...result,
        workflow: cloneLeadCashWorkflow(result.workflow),
      };
    },
    async getWorkflow(workflowId) {
      const workflow = workflows.get(workflowId);
      return workflow ? cloneLeadCashWorkflow(workflow) : null;
    },
    async listWorkflows() {
      return [...workflows.values()].map(cloneLeadCashWorkflow);
    },
    async health() {
      return {
        status: "unhealthy",
        mode: "memory",
      };
    },
    snapshot() {
      return [...workflows.values()].map((workflow) => summarizeLeadCashWorkflow(workflow));
    },
    async close() {},
  };
}

export function createUnavailableLeadCashStore() {
  return {
    async createWorkflow() {
      throw storageUnavailableError();
    },
    async appendEvent() {
      throw storageUnavailableError();
    },
    async getWorkflow() {
      return null;
    },
    async listWorkflows() {
      return [];
    },
    async health() {
      return {
        status: "unhealthy",
        mode: "unavailable",
      };
    },
    snapshot() {
      return [];
    },
    async close() {},
  };
}

export function getLeadCashStorageUnavailableError(message) {
  return storageUnavailableError(message);
}
