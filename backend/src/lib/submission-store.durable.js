import { Firestore } from "@google-cloud/firestore";
import { Pool } from "pg";

import { ApiError } from "./errors.js";
import {
  createEmptyDeliveryFields,
  mapDeliveryFields,
  normalizeChannelDelivery,
  postgresDeliveryAlterSql,
} from "./submission-delivery.js";
import { getStorageUnavailableError } from "./submission-store.memory.js";

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
  delivered_at TIMESTAMPTZ,
  email_delivery_delivered BOOLEAN NOT NULL DEFAULT FALSE,
  email_delivery_reason TEXT,
  email_delivery_provider TEXT,
  email_delivery_message_id TEXT,
  email_delivered_at TIMESTAMPTZ,
  sms_delivery_delivered BOOLEAN NOT NULL DEFAULT FALSE,
  sms_delivery_reason TEXT,
  sms_delivery_provider TEXT,
  sms_delivery_message_id TEXT,
  sms_delivered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS intake_submissions_kind_created_at_idx
  ON intake_submissions (submission_kind, created_at DESC);
`;

function cloneSubmission(submission) {
  return {
    ...submission,
  };
}

function wrapStorageError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  return getStorageUnavailableError("Durable submission storage is unavailable.");
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
    ...createEmptyDeliveryFields(),
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
    ...mapDeliveryFields(record),
  };
}

function collectionNameForSubmission(submissionKind) {
  const leadCollection = process.env.LEAD_REQUESTS_COLLECTION ?? "lead_requests";
  const emergencyCollection = process.env.EMERGENCY_REQUESTS_COLLECTION ?? "emergency_requests";
  return submissionKind === "emergency" ? emergencyCollection : leadCollection;
}

export function createFirestoreStore() {
  const db = new Firestore();

  function getRecordReference(id, submissionKind) {
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
      const emailDelivery = normalizeChannelDelivery(delivery.email);
      const smsDelivery = normalizeChannelDelivery(delivery.sms);
      const collectionNames = [
        process.env.LEAD_REQUESTS_COLLECTION ?? "lead_requests",
        process.env.EMERGENCY_REQUESTS_COLLECTION ?? "emergency_requests",
      ];
      const deliveryUpdate = {
        deliveryDelivered: Boolean(delivery.delivered),
        deliveryReason: delivery.reason ?? null,
        deliveryProvider: delivery.provider ?? emailDelivery.provider ?? smsDelivery.provider ?? null,
        deliveryMessageId: delivery.messageId ?? emailDelivery.messageId ?? smsDelivery.messageId ?? null,
        deliveredAt: delivery.deliveredAt ?? null,
        emailDeliveryDelivered: emailDelivery.delivered,
        emailDeliveryReason: emailDelivery.reason,
        emailDeliveryProvider: emailDelivery.provider,
        emailDeliveryMessageId: emailDelivery.messageId,
        emailDeliveredAt: emailDelivery.deliveredAt,
        smsDeliveryDelivered: smsDelivery.delivered,
        smsDeliveryReason: smsDelivery.reason,
        smsDeliveryProvider: smsDelivery.provider,
        smsDeliveryMessageId: smsDelivery.messageId,
        smsDeliveredAt: smsDelivery.deliveredAt,
        updatedAt: new Date().toISOString(),
      };

      try {
        for (const collectionName of collectionNames) {
          const ref = db.collection(collectionName).doc(id);
          const snapshot = await ref.get();

          if (snapshot.exists) {
            await ref.update(deliveryUpdate);
            return {
              id,
              ...fromFirestoreRecord(snapshot.data()),
              ...deliveryUpdate,
            };
          }
        }

        throw new ApiError(404, "NOT_FOUND", `Submission ${id} was not found.`);
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        throw getStorageUnavailableError("Durable submission storage is unavailable.");
      }
    },
    async health() {
      try {
        await Promise.all([ensureReadable("lead"), ensureReadable("emergency")]);

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

export function createPostgresStore(connectionString, { poolFactory = (config) => new Pool(config) } = {}) {
  const pool = poolFactory({
    connectionString,
    max: 3,
  });

  let schemaReadyPromise;

  async function ensureSchema() {
    if (!schemaReadyPromise) {
      schemaReadyPromise = pool.query(`${postgresSchemaSql}\n${postgresDeliveryAlterSql}`).catch((error) => {
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

        const emailDelivery = normalizeChannelDelivery(delivery.email);
        const smsDelivery = normalizeChannelDelivery(delivery.sms);

        const result = await pool.query(
          `
            UPDATE intake_submissions
               SET delivery_delivered = $2,
                   delivery_reason = $3,
                   delivery_provider = $4,
                   delivery_message_id = $5,
                   delivered_at = $6,
                   email_delivery_delivered = $7,
                   email_delivery_reason = $8,
                   email_delivery_provider = $9,
                   email_delivery_message_id = $10,
                   email_delivered_at = $11,
                   sms_delivery_delivered = $12,
                   sms_delivery_reason = $13,
                   sms_delivery_provider = $14,
                   sms_delivery_message_id = $15,
                   sms_delivered_at = $16,
                   updated_at = NOW()
             WHERE id = $1
          `,
          [
            id,
            Boolean(delivery.delivered),
            delivery.reason ?? null,
            delivery.provider ?? emailDelivery.provider ?? smsDelivery.provider ?? null,
            delivery.messageId ?? emailDelivery.messageId ?? smsDelivery.messageId ?? null,
            delivery.deliveredAt ?? null,
            emailDelivery.delivered,
            emailDelivery.reason,
            emailDelivery.provider,
            emailDelivery.messageId,
            emailDelivery.deliveredAt,
            smsDelivery.delivered,
            smsDelivery.reason,
            smsDelivery.provider,
            smsDelivery.messageId,
            smsDelivery.deliveredAt,
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

export function createPostgresStoreForTests(connectionString, poolFactory) {
  return createPostgresStore(connectionString, { poolFactory });
}
