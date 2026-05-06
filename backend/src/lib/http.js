import { ApiError } from "./errors.js";

export function json(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    ...headers,
  });
  response.end(JSON.stringify(payload));
}

export function buildCorsHeaders(origin) {
  const allowedOrigins = new Set([
    "http://localhost:5173",
    process.env.FRONTEND_ORIGIN,
  ].filter(Boolean));

  if (!origin || !allowedOrigins.has(origin)) {
    return {
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
      vary: "Origin",
    };
  }

  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
    vary: "Origin",
  };
}

export async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString("utf8");

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new ApiError(400, "INVALID_JSON", "Request body contains invalid JSON.");
  }
}
