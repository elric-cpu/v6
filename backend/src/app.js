import { createServer as createNodeServer } from "node:http";

import { ApiError, toErrorResponse } from "./lib/errors.js";
import { buildCorsHeaders, json, readJsonBody } from "./lib/http.js";
import { getHealthStatus } from "./services/health.js";
import { submitLeadRequest } from "./services/leads.js";
import { submitEmergencyRequest } from "./services/emergency-requests.js";
import { getImages, getPlans, getServiceAreas, getServices } from "./services/public-content.js";
import { getSubscriptionRecommendation } from "./services/subscription-recommendation.js";

const allowedMethodsByPath = new Map([
  ["/health", new Set(["GET"])],
  ["/api/services", new Set(["GET"])],
  ["/api/images", new Set(["GET"])],
  ["/api/plans", new Set(["GET"])],
  ["/api/service-areas", new Set(["GET"])],
  ["/api/tools/subscription-recommendation", new Set(["GET"])],
  ["/api/leads", new Set(["POST"])],
  ["/api/emergency-requests", new Set(["POST"])],
]);

async function routeRequest(request, response) {
  const url = new URL(request.url, "http://localhost");
  const corsHeaders = buildCorsHeaders(request.headers.origin);

  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders);
    response.end();
    return;
  }

  if (request.method === "GET" && url.pathname === "/health") {
    json(response, 200, await getHealthStatus(), corsHeaders);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/services") {
    json(response, 200, { services: getServices() }, corsHeaders);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/images") {
    json(response, 200, { images: getImages() }, corsHeaders);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/plans") {
    json(response, 200, { plans: getPlans() }, corsHeaders);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/service-areas") {
    json(response, 200, { areas: getServiceAreas() }, corsHeaders);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/tools/subscription-recommendation") {
    json(response, 200, getSubscriptionRecommendation(url.searchParams), corsHeaders);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/leads") {
    const body = await readJsonBody(request);
    const result = await submitLeadRequest(body);
    json(response, 201, result, corsHeaders);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/emergency-requests") {
    const body = await readJsonBody(request);
    const result = await submitEmergencyRequest(body);
    json(response, 201, result, corsHeaders);
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
