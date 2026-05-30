import { Firestore } from "@google-cloud/firestore";
import { Pool } from "pg";

import { ApiError } from "./errors.js";

const postgresSchemaSql = `
CREATE TABLE IF NOT EXISTS intake_submissions (
  id UUID PRIMARY KEY,
  submission_kind TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  zip_code TEXT,
  service_type TEXT NOT NULL,
  message TEXT NOT NULL,
  urgency TEXT NOT NULL,
  source_page TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivery_delivered BOOLEAN NOT NULL DEFAULT FALSE,
  delivery_reason TEXT,
  delivery_provider TEXT,
  delivery_message_id TEXT,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS intake_submissions_kind_created_at_idx
  ON intake_submissions (submission_kind, created_at DESC);
`;

function cloneSubmission(submission) {
  return {
    ...submission,
  };
}

function normalizeBackendName(value) {
  return String(value ?? "").trim().toLowerCase();
}

function storageUnavailableError(message = "Durable submission storage is not configured.") {
  return new ApiError(503, "DATABASE_UNAVAILABLE", message);
}

function wrapStorageError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  return storageUnavailableError("Durable submission storage is unavailable.");
}

function createMemoryStore() {
  const submissions = [];

  return {
    async createSubmission(submission) {
      const stored = {
        ...cloneSubmission(submission),
        deliveryDelivered: false,
        deliveryReason: null,
        deliveryProvider: null,
        deliveryMessageId: null,
        deliveredAt: null,
        updatedAt: submission.createdAt,
      };

      submissions.push(stored);
      return cloneSubmission(stored);
    },
    async updateDelivery(id, delivery) {
      const record = submissions.find((entry) => entry.id === id);
      if (!record) {
        throw new ApiError(404, "NOT_FOUND", `Submission ${id} was not found.`);
      }

      record.deliveryDelivered = Boolean(delivery.delivered);
      record.deliveryReason = delivery.reason ?? null;
      record.deliveryProvider = delivery.provider ?? null;
      record.deliveryMessageId = delivery.messageId ?? null;
      record.deliveredAt = delivery.deliveredAt ?? null;
      record.updatedAt = new Date().toISOString();
      return cloneSubmission(record);
    },
    async health() {
      return {
        status: "unhealthy",
        mode: "memory",
      };
    },
    snapshot(kind) {
      return submissions
        .filter((entry) => entry.submissionKind === kind)
        .map(cloneSubmission);
    },
    async close() {},
  };
}

function createUnavailableStore() {
  return {
    async createSubmission() {
      throw storageUnavailableError();
    },
    async updateDelivery() {
      throw storageUnavailableError();
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

function toFirestoreRecord(submission) {
  return {
    id: submission.id,
    submissionKind: submission.submissionKind,
    name: submission.name,
    phone: submission.phone,
    email: submission.email ?? null,
    address: submission.address ?? null,
    city: submission.city ?? null,
    zipCode: submission.zipCode ?? null,
    serviceType: submission.serviceType,
    message: submission.message,
    urgency: submission.urgency,
    sourcePage: submission.sourcePage ?? null,
    createdAt: submission.createdAt,
    updatedAt: submission.createdAt,
    deliveryDelivered: false,
    deliveryReason: null,
    deliveryProvider: null,
    deliveryMessageId: null,
    deliveredAt: null,
  };
}

function fromFirestoreRecord(record) {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    submissionKind: record.submissionKind,
    name: record.name,
    phone: record.phone,
    email: record.email ?? null,
    address: record.address ?? null,
    city: record.city ?? null,
    zipCode: record.zipCode ?? null,
    serviceType: record.serviceType,
    message: record.message,
    urgency: record.urgency,
    sourcePage: record.sourcePage ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? record.createdAt,
    deliveryDelivered: Boolean(record.deliveryDelivered),
    deliveryReason: record.deliveryReason ?? null,
    deliveryProvider: record.deliveryProvider ?? null,
    deliveryMessageId: record.deliveryMessageId ?? null,
    deliveredAt: record.deliveredAt ?? null,
  };
}

function collectionNameForSubmission(submissionKind) {
  const leadCollection = process.env.LEAD_REQUESTS_COLLECTION ?? "lead_requests";
  const emergencyCollection = process.env.EMERGENCY_REQUESTS_COLLECTION ?? "emergency_requests";
  return submissionKind === "emergency" ? emergencyCollection : leadCollection;
}

function createFirestoreStore() {
  const db = new Firestore();

  async function getRecordReference(id, submissionKind) {
    return db.collection(collectionNameForSubmission(submissionKind)).doc(id);
  }

  async function ensureReadable(kind) {
    await db.collection(collectionNameForSubmission(kind)).limit(1).get();
  }

  return {
    async createSubmission(submission) {
      const ref = await getRecordReference(submission.id, submission.submissionKind);

      try {
        await ref.set(toFirestoreRecord(submission));
        return cloneSubmission(toFirestoreRecord(submission));
      } catch (error) {
        throw wrapStorageError(error);
      }
    },
    async updateDelivery(id, delivery) {
      const collectionNames = [
        process.env.LEAD_REQUESTS_COLLECTION ?? "lead_requests",
        process.env.EMERGENCY_REQUESTS_COLLECTION ?? "emergency_requests",
      ];
      const updatePayload = {
        deliveryDelivered: Boolean(delivery.delivered),
        deliveryReason: delivery.reason ?? null,
        deliveryProvider: delivery.provider ?? null,
        deliveryMessageId: delivery.messageId ?? null,
        deliveredAt: delivery.deliveredAt ?? null,
        updatedAt: new Date().toISOString(),
      };

      try {
        for (const collectionName of collectionNames) {
          const ref = db.collection(collectionName).doc(id);
          const snapshot = await ref.get();

          if (snapshot.exists) {
            await ref.update(updatePayload);
            return {
              id,
              ...fromFirestoreRecord(snapshot.data()),
              ...updatePayload,
            };
          }
        }

        throw new ApiError(404, "NOT_FOUND", `Submission ${id} was not found.`);
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        throw storageUnavailableError("Durable submission storage is unavailable.");
      }
    },
    async health() {
      try {
        await Promise.all([
          ensureReadable("lead"),
          ensureReadable("emergency"),
        ]);

        return {
          status: "healthy",
          mode: "firestore",
        };
      } catch {
        return {
          status: "unhealthy",
          mode: "firestore",
        };
      }
    },
    snapshot() {
      return [];
    },
    async close() {},
  };
}

function createPostgresStore(connectionString, { poolFactory = (config) => new Pool(config) } = {}) {
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
    async createSubmission(submission) {
      try {
        await ensureSchema();

        await pool.query(
          `
            INSERT INTO intake_submissions (
              id,
              submission_kind,
              name,
              phone,
              email,
              address,
              city,
              zip_code,
              service_type,
              message,
              urgency,
              source_page,
              created_at,
              updated_at,
              delivery_delivered,
              delivery_reason,
              delivery_provider,
              delivery_message_id,
              delivered_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
            )
          `,
          [
            submission.id,
            submission.submissionKind,
            submission.name,
            submission.phone,
            submission.email ?? null,
            submission.address ?? null,
            submission.city ?? null,
            submission.zipCode ?? null,
            submission.serviceType,
            submission.message,
            submission.urgency,
            submission.sourcePage ?? null,
            submission.createdAt,
            submission.createdAt,
            false,
            null,
            null,
            null,
            null,
          ],
        );

        return cloneSubmission(submission);
      } catch (error) {
        throw wrapStorageError(error);
      }
    },
    async updateDelivery(id, delivery) {
      try {
        await ensureSchema();

        const result = await pool.query(
          `
            UPDATE intake_submissions
               SET delivery_delivered = $2,
                   delivery_reason = $3,
                   delivery_provider = $4,
                   delivery_message_id = $5,
                   delivered_at = $6,
                   updated_at = NOW()
             WHERE id = $1
          `,
          [
            id,
            Boolean(delivery.delivered),
            delivery.reason ?? null,
            delivery.provider ?? null,
            delivery.messageId ?? null,
            delivery.deliveredAt ?? null,
          ],
        );

        if (result.rowCount === 0) {
          throw new ApiError(404, "NOT_FOUND", `Submission ${id} was not found.`);
        }

        return { id, ...delivery };
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

export function createPostgresStoreForTests(connectionString, poolFactory) {
  return createPostgresStore(connectionString, { poolFactory });
}
