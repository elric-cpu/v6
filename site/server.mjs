import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("./dist", import.meta.url)));
const port = Number(process.env.PORT ?? 8080);
const apiOrigin = process.env.API_ORIGIN ?? "https://benson-api-v6-ecdo5oua2a-uw.a.run.app";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function resolveAsset(requestUrl) {
  const parsed = new URL(requestUrl, "http://localhost");
  const decoded = decodeURIComponent(parsed.pathname);
  const normalized = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  let candidate = join(root, normalized);

  if (!candidate.startsWith(root)) {
    return null;
  }

  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    candidate = join(candidate, "index.html");
  } else if (!existsSync(candidate) && !extname(candidate)) {
    candidate = join(candidate, "index.html");
  }

  return candidate.startsWith(root) && existsSync(candidate) ? candidate : null;
}

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

async function proxyApiRequest(request, response) {
  const parsed = new URL(request.url ?? "/", apiOrigin);
  const target = new URL(parsed.pathname + parsed.search, apiOrigin);
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === "string" && !["host", "content-length"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  try {
    const method = request.method ?? "GET";
    const hasBody = !["GET", "HEAD"].includes(method);
    const upstream = await fetch(target, {
      method,
      headers,
      body: hasBody ? await readRequestBody(request) : undefined,
    });

    response.writeHead(upstream.status, Object.fromEntries(upstream.headers.entries()));
    response.end(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    response.writeHead(502, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: { code: "API_PROXY_ERROR", message: "The API could not be reached." } }));
  }
}

createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

  if (pathname.startsWith("/api/")) {
    void proxyApiRequest(request, response);
    return;
  }

  const asset = resolveAsset(request.url ?? "/");

  if (!asset) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "cache-control": asset.endsWith(".html") ? "no-cache" : "public, max-age=31536000, immutable",
    "content-type": contentTypes[extname(asset)] ?? "application/octet-stream",
  });
  createReadStream(asset).pipe(response);
}).listen(port, "0.0.0.0", () => {
  console.log(`Benson Astro site listening on http://0.0.0.0:${port}`);
});
