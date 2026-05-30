import { createServer as createNodeServer } from "node:http";

import { ApiError, toErrorResponse } from "./lib/errors.js";
import { buildCorsHeaders, json, readJsonBody } from "./lib/http.js";
import { getHealthStatus } from "./services/health.js";
import { submitLeadRequest } from "./services/leads.js";
import { submitEmergencyRequest } from "./services/emergency-requests.js";
import { getImages, getPlans, getServiceAreas, getServices } from "./services/public-content.js";
import { getSubscriptionRecommendation } from "./services/subscription-recommendation.js";

const routeHandlers = new Map([
  ["GET /health", async (_, response, headers) => {
    json(response, 200, await getHealthStatus(), headers);
  }],
  ["GET /api/services", async (_, response, headers) => {
    json(response, 200, { services: getServices() }, headers);
  }],
  ["GET /api/images", async (_, response, headers) => {
    json(response, 200, { images: getImages() }, headers);
  }],
  ["GET /api/plans", async (_, response, headers) => {
    json(response, 200, { plans: getPlans() }, headers);
  }],
  ["GET /api/service-areas", async (_, response, headers) => {
    json(response, 200, { areas: getServiceAreas() }, headers);
  }],
  ["GET /api/tools/subscription-recommendation", async (request, response, headers, url) => {
    json(response, 200, getSubscriptionRecommendation(url.searchParams), headers);
  }],
  ["POST /api/leads", async (request, response, headers) => {
    const result = await submitLeadRequest(await readJsonBody(request));
    json(response, 201, result, headers);
  }],
  ["POST /api/emergency-requests", async (request, response, headers) => {
    const result = await submitEmergencyRequest(await readJsonBody(request));
    json(response, 201, result, headers);
  }],
]);

const allowedMethodsByPath = new Map();

for (const routeKey of routeHandlers.keys()) {
  const [method, pathname] = routeKey.split(" ");
  const allowedMethods = allowedMethodsByPath.get(pathname) ?? new Set();
  allowedMethods.add(method);
  allowedMethodsByPath.set(pathname, allowedMethods);
}

async function routeRequest(request, response) {
  const url = new URL(request.url, "http://localhost");
  const corsHeaders = buildCorsHeaders(request.headers.origin);

  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders);
    response.end();
    return;
  }

  const handler = routeHandlers.get(`${request.method} ${url.pathname}`);
  if (handler) {
    await handler(request, response, corsHeaders, url);
    return;
  }

  if (allowedMethodsByPath.has(url.pathname)) {
    throw new ApiError(405, "METHOD_NOT_ALLOWED", `Method ${request.method} is not allowed for ${url.pathname}.`);
  }

  throw new ApiError(404, "NOT_FOUND", `Route ${request.method} ${url.pathname} was not found.`);
}

export function createServer() {
  return createNodeServer(async (request, response) => {
    try {
      await routeRequest(request, response);
    } catch (error) {
      const { statusCode, payload } = toErrorResponse(error);
      json(response, statusCode, payload, buildCorsHeaders(request.headers.origin));
    }
  });
}
