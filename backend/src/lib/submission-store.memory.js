import { ApiError } from "./errors.js";

function cloneSubmission(submission) {
  return {
    ...submission,
  };
}

function storageUnavailableError(message = "Durable submission storage is not configured.") {
  return new ApiError(503, "DATABASE_UNAVAILABLE", message);
}

function normalizeChannelDelivery(delivery) {
  if (!delivery || typeof delivery !== "object") {
    return {
      delivered: false,
      reason: null,
      provider: null,
      messageId: null,
      deliveredAt: null,
    };
  }

  return {
    delivered: Boolean(delivery.delivered),
    reason: delivery.reason ?? null,
    provider: delivery.provider ?? null,
    messageId: delivery.messageId ?? null,
    deliveredAt: delivery.deliveredAt ?? null,
  };
}

export function createMemoryStore() {
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
        emailDeliveryDelivered: false,
        emailDeliveryReason: null,
        emailDeliveryProvider: null,
        emailDeliveryMessageId: null,
        emailDeliveredAt: null,
        smsDeliveryDelivered: false,
        smsDeliveryReason: null,
        smsDeliveryProvider: null,
        smsDeliveryMessageId: null,
        smsDeliveredAt: null,
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

      const emailDelivery = normalizeChannelDelivery(delivery.email);
      const smsDelivery = normalizeChannelDelivery(delivery.sms);

      record.deliveryDelivered = Boolean(delivery.delivered);
      record.deliveryReason = delivery.reason ?? null;
      record.deliveryProvider = delivery.provider ?? emailDelivery.provider ?? smsDelivery.provider ?? null;
      record.deliveryMessageId = delivery.messageId ?? emailDelivery.messageId ?? smsDelivery.messageId ?? null;
      record.deliveredAt = delivery.deliveredAt ?? null;
      record.emailDeliveryDelivered = emailDelivery.delivered;
      record.emailDeliveryReason = emailDelivery.reason;
      record.emailDeliveryProvider = emailDelivery.provider;
      record.emailDeliveryMessageId = emailDelivery.messageId;
      record.emailDeliveredAt = emailDelivery.deliveredAt;
      record.smsDeliveryDelivered = smsDelivery.delivered;
      record.smsDeliveryReason = smsDelivery.reason;
      record.smsDeliveryProvider = smsDelivery.provider;
      record.smsDeliveryMessageId = smsDelivery.messageId;
      record.smsDeliveredAt = smsDelivery.deliveredAt;
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

export function createUnavailableStore() {
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

export function getStorageUnavailableError(message) {
  return storageUnavailableError(message);
}
