export function getHealthStatus() {
  const services = {
    database: process.env.DATABASE_URL ? "healthy" : "unhealthy",
    email: process.env.EMAIL_API_KEY && process.env.EMAIL_FROM ? "healthy" : "unhealthy",
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
