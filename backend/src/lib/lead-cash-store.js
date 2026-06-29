import {
  createLeadCashFirestoreStore,
  createPostgresLeadCashStore,
} from "./lead-cash-store.durable.js";
import {
  createMemoryLeadCashStore,
  createUnavailableLeadCashStore,
} from "./lead-cash-store.memory.js";

function normalizeBackendName(value) {
  return String(value ?? "").trim().toLowerCase();
}

let cachedStore = null;
let cachedStoreKey = null;

function resolveStoreMode() {
  const explicit = normalizeBackendName(process.env.LEAD_CASH_STORAGE_BACKEND);
  if (explicit) {
    return explicit;
  }

  if (process.env.DATABASE_URL) {
    return "postgres";
  }

  if ((process.env.NODE_ENV ?? "") === "test") {
    return "memory";
  }

  if ((process.env.NODE_ENV ?? "") === "production") {
    return "unavailable";
  }

  return "memory";
}

function resolveStoreKey() {
  return [
    process.env.NODE_ENV ?? "",
    process.env.DATABASE_URL ?? "",
    process.env.LEAD_CASH_STORAGE_BACKEND ?? "",
  ].join("::");
}

function createStoreByMode(mode) {
  if (mode === "postgres") {
    return process.env.DATABASE_URL ? createPostgresLeadCashStore(process.env.DATABASE_URL) : createUnavailableLeadCashStore();
  }

  if (mode === "firestore") {
    return createLeadCashFirestoreStore();
  }

  if (mode === "memory") {
    return createMemoryLeadCashStore();
  }

  return createUnavailableLeadCashStore();
}

export function getLeadCashStore() {
  const storeKey = resolveStoreKey();

  if (cachedStore && cachedStoreKey === storeKey) {
    return cachedStore;
  }

  if (cachedStore?.close) {
    cachedStore.close().catch(() => {});
  }

  cachedStore = createStoreByMode(resolveStoreMode());
  cachedStoreKey = storeKey;
  return cachedStore;
}

export async function getLeadCashStoreHealth() {
  return getLeadCashStore().health();
}

export async function getLeadCashWorkflow(workflowId) {
  return getLeadCashStore().getWorkflow(workflowId);
}

export function getLeadCashWorkflowSnapshots() {
  return getLeadCashStore().snapshot();
}

export function resetLeadCashStoreForTests() {
  if (cachedStore?.close) {
    cachedStore.close().catch(() => {});
  }

  cachedStore = null;
  cachedStoreKey = null;
}
