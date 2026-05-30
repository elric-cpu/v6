export function normalizeChannelDelivery(delivery) {
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

export function createEmptyDeliveryFields() {
  return {
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
  };
}

export function mapDeliveryFields(record) {
  return {
    deliveryDelivered: Boolean(record.deliveryDelivered),
    deliveryReason: record.deliveryReason ?? null,
    deliveryProvider: record.deliveryProvider ?? null,
    deliveryMessageId: record.deliveryMessageId ?? null,
    deliveredAt: record.deliveredAt ?? null,
    emailDeliveryDelivered: Boolean(record.emailDeliveryDelivered),
    emailDeliveryReason: record.emailDeliveryReason ?? null,
    emailDeliveryProvider: record.emailDeliveryProvider ?? null,
    emailDeliveryMessageId: record.emailDeliveryMessageId ?? null,
    emailDeliveredAt: record.emailDeliveredAt ?? null,
    smsDeliveryDelivered: Boolean(record.smsDeliveryDelivered),
    smsDeliveryReason: record.smsDeliveryReason ?? null,
    smsDeliveryProvider: record.smsDeliveryProvider ?? null,
    smsDeliveryMessageId: record.smsDeliveryMessageId ?? null,
    smsDeliveredAt: record.smsDeliveredAt ?? null,
  };
}

export const postgresDeliveryAlterSql = `
ALTER TABLE intake_submissions
  ADD COLUMN IF NOT EXISTS email_delivery_delivered BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_delivery_reason TEXT,
  ADD COLUMN IF NOT EXISTS email_delivery_provider TEXT,
  ADD COLUMN IF NOT EXISTS email_delivery_message_id TEXT,
  ADD COLUMN IF NOT EXISTS email_delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sms_delivery_delivered BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sms_delivery_reason TEXT,
  ADD COLUMN IF NOT EXISTS sms_delivery_provider TEXT,
  ADD COLUMN IF NOT EXISTS sms_delivery_message_id TEXT,
  ADD COLUMN IF NOT EXISTS sms_delivered_at TIMESTAMPTZ;
`;
