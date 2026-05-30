import { getEmailHealthStatus } from "../lib/resend-mailer.js";
import { getSubmissionStoreHealth } from "../lib/submission-store.js";

export async function getHealthStatus() {
  const [databaseHealth, emailHealth] = await Promise.all([
    getSubmissionStoreHealth(),
    Promise.resolve(getEmailHealthStatus()),
  ]);

  const services = {
    database: databaseHealth.status,
    email: emailHealth.status,
    stripe: process.env.STRIPE_SECRET_KEY ? "healthy" : "unhealthy",
  };

  const healthyCount = Object.values(services).filter((value) => value === "healthy").length;
  const status = healthyCount === 3 ? "healthy" : healthyCount === 0 ? "degraded" : "degraded";

  return {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.1.0",
    metadata: {
      frontendOrigin: process.env.FRONTEND_ORIGIN ?? null,
      port: Number(process.env.PORT ?? 4000),
    },
    services,
  };
}
