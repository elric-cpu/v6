import type { IntegrationHealth, ProviderStatus } from "@benson/shared";

function hasConfig(...keys: string[]): boolean {
  return keys.every((key) => typeof process.env[key] === "string" && process.env[key]?.trim());
}

function providerStatus(providerEnabledKey: string, requiredConfig: string[]): ProviderStatus {
  const enabled = process.env[providerEnabledKey] === "true";

  if (!enabled) {
    return "disabled";
  }

  return hasConfig(...requiredConfig) ? "healthy" : "unhealthy";
}

function integration(
  provider: string,
  owner: string,
  providerEnabledKey: string,
  requiredConfig: string[],
  failureMode: string,
  verificationCommand: string,
): IntegrationHealth {
  const status = providerStatus(providerEnabledKey, requiredConfig);

  return {
    status,
    provider: status === "disabled" ? null : provider,
    owner,
    requiredConfig,
    failureMode,
    verificationCommand,
  };
}

export function getIntegrationHealth() {
  return {
    database: integration(
      "firestore",
      "Backend/Ops",
      "FIRESTORE_ENABLED",
      ["GOOGLE_CLOUD_PROJECT"],
      "Lead storage is unavailable; reject or store locally only in development.",
      "curl -sS https://api.bensonhomesolutions.com/health",
    ),
    email: integration(
      "gmail-or-resend",
      "Backend/Ops",
      "EMAIL_NOTIFICATIONS_ENABLED",
      ["LEAD_NOTIFICATION_TO"],
      "Submission persists but owner notification is unavailable.",
      "controlled provider health check from admin integrations",
    ),
    sms: integration(
      "twilio",
      "Backend/Ops",
      "SMS_NOTIFICATIONS_ENABLED",
      ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "SMS_TO"],
      "Emergency submission persists but SMS notification is unavailable.",
      "controlled Twilio test from admin integrations",
    ),
    stripe: integration(
      "stripe",
      "Backend/Ops",
      "STRIPE_ENABLED",
      ["STRIPE_SECRET_KEY"],
      "Payment actions remain disabled.",
      "stripe webhook/provider smoke in non-production",
    ),
    docusign: integration(
      "docusign",
      "Backend/Ops",
      "DOCUSIGN_ENABLED",
      ["DOCUSIGN_INTEGRATION_KEY", "DOCUSIGN_ACCOUNT_ID"],
      "Document sends remain draft/manual.",
      "DocuSign sandbox envelope smoke",
    ),
    quickbooks: integration(
      "quickbooks",
      "Backend/Ops",
      "QUICKBOOKS_ENABLED",
      ["QUICKBOOKS_CLIENT_ID", "QUICKBOOKS_CLIENT_SECRET", "QUICKBOOKS_REFRESH_TOKEN", "QUICKBOOKS_REALM_ID"],
      "Accounting sync remains disabled.",
      "QuickBooks sandbox sync smoke",
    ),
  };
}

export function summarizeStatus() {
  const integrations = getIntegrationHealth();
  const statuses = Object.values(integrations).map((integrationHealth) => integrationHealth.status);

  return statuses.every((status) => status === "healthy" || status === "disabled") ? "healthy" : "degraded";
}
