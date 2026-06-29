import { randomUUID } from "node:crypto";

import { Firestore } from "@google-cloud/firestore";
import { Pool } from "pg";

import { ApiError } from "./errors.js";
import {
  applyLeadCashEvent,
  cloneLeadCashWorkflow,
  createLeadCashWorkflow,
  summarizeLeadCashWorkflow,
} from "./lead-cash-state.js";
import { getLeadCashStorageUnavailableError } from "./lead-cash-store.memory.js";

const postgresSchemaSql = `
CREATE TABLE IF NOT EXISTS lead_cash_workflows (
  id UUID PRIMARY KEY,
  source_kind TEXT NOT NULL,
  state TEXT NOT NULL,
  state_index INTEGER NOT NULL,
  provider_ids JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  last_event_key TEXT,
  last_event_type TEXT,
  last_event_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS lead_cash_events (
  id UUID PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES lead_cash_workflows(id) ON DELETE CASCADE,
  event_key TEXT NOT NULL,
  event_type TEXT NOT NULL,
  provider TEXT,
  provider_event_id TEXT,
  previous_state TEXT NOT NULL,
  next_state TEXT NOT NULL,
  provider_ids JSONB NOT NULL DEFAULT '{}'::jsonb,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workflow_id, event_key),
  UNIQUE (provider, provider_event_id)
);
`;

function wrapStorageError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  return getLeadCashStorageUnavailableError("Lead-to-cash storage is unavailable.");
}

function rowToWorkflow(row, events = []) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    sourceKind: row.source_kind,
    state: row.state,
    stateIndex: row.state_index,
    providerIds: row.provider_ids ?? {},
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastEventKey: row.last_event_key ?? null,
    lastEventType: row.last_event_type ?? null,
    lastEventAt: row.last_event_at ?? null,
    events,
  };
}

function rowToEvent(row) {
  return {
    eventKey: row.event_key,
    eventType: row.event_type,
    provider: row.provider ?? null,
    providerEventId: row.provider_event_id ?? null,
    previousState: row.previous_state,
    nextState: row.next_state,
    occurredAt: row.occurred_at,
    payload: row.payload ?? {},
    providerIds: row.provider_ids ?? {},
  };
}

function createFirestoreStore() {
  return {
    async createWorkflow(workflow) {
      return cloneLeadCashWorkflow(createLeadCashWorkflow(workflow));
    },
    async appendEvent() {
      throw getLeadCashStorageUnavailableError("Lead-to-cash Firestore persistence is not configured.");
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
        mode: "firestore",
      };
    },
    snapshot() {
      return [];
    },
    async close() {},
  };
}

export function createPostgresLeadCashStore(connectionString, { poolFactory = (config) => new Pool(config) } = {}) {
  const pool = poolFactory({
    connectionString,
    max: 3,
  });

  let schemaReadyPromise;

  async function ensureSchema() {
    if (!schemaReadyPromise) {
      schemaReadyPromise = pool.query(postgresSchemaSql).catch((error) => {
        schemaReadyPromise = undefined;
        throw error;
      });
    }

    await schemaReadyPromise;
  }

  return {
    async createWorkflow(record) {
      try {
        await ensureSchema();

        if (!record?.id) {
          throw new ApiError(400, "VALIDATION_ERROR", "Lead-cash workflows require an id.");
        }

        const workflow = createLeadCashWorkflow(record);
        await pool.query(
          `
            INSERT INTO lead_cash_workflows (
              id,
              source_kind,
              state,
              state_index,
              provider_ids,
              metadata,
              created_at,
              updated_at,
              last_event_key,
              last_event_type,
              last_event_at
            ) VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8,$9,$10,$11)
            ON CONFLICT (id) DO NOTHING
          `,
          [
            workflow.id,
            workflow.sourceKind,
            workflow.state,
            workflow.stateIndex,
            JSON.stringify(workflow.providerIds),
            JSON.stringify(workflow.metadata),
            workflow.createdAt,
            workflow.updatedAt,
            workflow.lastEventKey,
            workflow.lastEventType,
            workflow.lastEventAt,
          ],
        );

        const { rows } = await pool.query(`SELECT * FROM lead_cash_workflows WHERE id = $1`, [workflow.id]);
        return rows[0] ? cloneLeadCashWorkflow(rowToWorkflow(rows[0])) : null;
      } catch (error) {
        throw wrapStorageError(error);
      }
    },
    async appendEvent(workflowId, eventInput) {
      const client = await pool.connect();

      try {
        await ensureSchema();
        await client.query("BEGIN");

        const workflowResult = await client.query(`SELECT * FROM lead_cash_workflows WHERE id = $1 FOR UPDATE`, [workflowId]);
        const row = workflowResult.rows[0];

        if (!row) {
          throw new ApiError(404, "NOT_FOUND", `Workflow ${workflowId} was not found.`);
        }

        const eventResult = await client.query(`SELECT * FROM lead_cash_events WHERE workflow_id = $1 ORDER BY occurred_at ASC, created_at ASC`, [workflowId]);
        const currentWorkflow = rowToWorkflow(row, eventResult.rows.map(rowToEvent));
        const result = applyLeadCashEvent(currentWorkflow, eventInput);

        if (!result.applied) {
          await client.query("ROLLBACK");
          return {
            ...result,
            workflow: cloneLeadCashWorkflow(result.workflow),
          };
        }

        await client.query(
          `
            INSERT INTO lead_cash_events (
              id,
              workflow_id,
              event_key,
              event_type,
              provider,
              provider_event_id,
              previous_state,
              next_state,
              provider_ids,
              payload,
              occurred_at
            ) VALUES (
              $1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11
            )
          `,
          [
            randomUUID(),
            workflowId,
            result.event.eventKey,
            result.event.eventType,
            result.event.provider,
            result.event.providerEventId,
            result.event.previousState,
            result.event.nextState,
            JSON.stringify(result.event.providerIds),
            JSON.stringify(result.event.payload),
            result.event.occurredAt,
          ],
        );

        await client.query(
          `
            UPDATE lead_cash_workflows
               SET state = $2,
                   state_index = $3,
                   provider_ids = $4::jsonb,
                   updated_at = $5,
                   last_event_key = $6,
                   last_event_type = $7,
                   last_event_at = $8
             WHERE id = $1
          `,
          [
            workflowId,
            result.workflow.state,
            result.workflow.stateIndex,
            JSON.stringify(result.workflow.providerIds),
            result.workflow.updatedAt,
            result.workflow.lastEventKey,
            result.workflow.lastEventType,
            result.workflow.lastEventAt,
          ],
        );

        await client.query("COMMIT");
        return {
          ...result,
          workflow: cloneLeadCashWorkflow(result.workflow),
        };
      } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        throw wrapStorageError(error);
      } finally {
        client.release();
      }
    },
    async getWorkflow(workflowId) {
      try {
        await ensureSchema();

        const [workflowResult, eventsResult] = await Promise.all([
          pool.query(`SELECT * FROM lead_cash_workflows WHERE id = $1`, [workflowId]),
          pool.query(`SELECT * FROM lead_cash_events WHERE workflow_id = $1 ORDER BY occurred_at ASC, created_at ASC`, [workflowId]),
        ]);

        const workflow = rowToWorkflow(workflowResult.rows[0], eventsResult.rows.map(rowToEvent));
        return workflow ? cloneLeadCashWorkflow(workflow) : null;
      } catch (error) {
        throw wrapStorageError(error);
      }
    },
    async listWorkflows() {
      try {
        await ensureSchema();
        const result = await pool.query(`SELECT * FROM lead_cash_workflows ORDER BY created_at DESC`);
        return result.rows.map((row) => cloneLeadCashWorkflow(rowToWorkflow(row)));
      } catch (error) {
        throw wrapStorageError(error);
      }
    },
    async health() {
      try {
        await ensureSchema();
        await pool.query("SELECT 1");
        return {
          status: "healthy",
          mode: "postgres",
        };
      } catch {
        return {
          status: "unhealthy",
          mode: "postgres",
        };
      }
    },
    snapshot() {
      return [];
    },
    async close() {
      await pool.end();
    },
  };
}

export function createLeadCashFirestoreStore() {
  return createFirestoreStore();
}
