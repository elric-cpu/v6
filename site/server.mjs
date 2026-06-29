import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("./dist", import.meta.url)));
const port = Number(process.env.PORT ?? 8080);

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

createServer((request, response) => {
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
