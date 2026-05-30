import { createFirestoreStore, createPostgresStore, createPostgresStoreForTests } from "./submission-store.durable.js";
import { createMemoryStore, createUnavailableStore } from "./submission-store.memory.js";

function normalizeBackendName(value) {
  return String(value ?? "").trim().toLowerCase();
}

let cachedStore = null;
let cachedStoreKey = null;

function resolveStoreMode() {
  const explicit = normalizeBackendName(process.env.LEAD_STORAGE_BACKEND);
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
    return "firestore";
  }

  return "memory";
}

function resolveStoreKey() {
  return [
    process.env.NODE_ENV ?? "",
    process.env.DATABASE_URL ?? "",
    process.env.LEAD_STORAGE_BACKEND ?? "",
    process.env.LEAD_REQUESTS_COLLECTION ?? "",
    process.env.EMERGENCY_REQUESTS_COLLECTION ?? "",
  ].join("::");
}

function createStoreByMode(mode) {
  if (mode === "postgres") {
    return process.env.DATABASE_URL ? createPostgresStore(process.env.DATABASE_URL) : createUnavailableStore();
  }

  if (mode === "firestore") {
    return createFirestoreStore();
  }

  if (mode === "memory") {
    return createMemoryStore();
  }

  return createUnavailableStore();
}

export function getSubmissionStore() {
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

export async function getSubmissionStoreHealth() {
  return getSubmissionStore().health();
}

export function getSubmissionSnapshots(kind) {
  return getSubmissionStore().snapshot(kind);
}

export function resetSubmissionStoreForTests() {
  if (cachedStore?.close) {
    cachedStore.close().catch(() => {});
  }

  cachedStore = null;
  cachedStoreKey = null;
}

export { createPostgresStoreForTests };
