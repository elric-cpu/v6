import { getEmailHealthStatus } from "../lib/resend-mailer.js";
import { getSubmissionStoreHealth } from "../lib/submission-store.js";
import { getSmsHealthStatus } from "../lib/twilio-sms.js";

export async function getHealthStatus() {
  const [databaseHealth, emailHealth] = await Promise.all([
    getSubmissionStoreHealth(),
    getEmailHealthStatus(),
  ]);

  const services = {
    database: databaseHealth.status,
    email: emailHealth.status,
    sms: getSmsHealthStatus().status,
    stripe: process.env.STRIPE_SECRET_KEY ? "healthy" : "unhealthy",
  };

  return {
    status: Object.values(services).every((value) => value === "healthy") ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.1.0",
    metadata: {
      frontendOrigin: process.env.FRONTEND_ORIGIN ?? null,
      port: Number(process.env.PORT ?? 4000),
    },
    services,
  };
}
