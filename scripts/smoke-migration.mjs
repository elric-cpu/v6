import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const requiredSiteFiles = [
  "index.html",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "llms-full.txt",
  "services/index.html",
  "areas/index.html",
  "resources/index.html",
  "contact/index.html",
  "admin/index.html",
  "tools/subscription-recommendation/index.html",
];

const requiredSources = [
  "Dockerfile",
  "site/server.mjs",
  "backend/Dockerfile",
  "backend/src-hono/app.ts",
  "docs/astro-hono-migration-tasklist.md",
  "docs/migration-handoff.md",
];

const failures = [];

for (const file of requiredSources) {
  if (!existsSync(file)) {
    failures.push(`Missing required source: ${file}`);
  }
}

for (const file of requiredSiteFiles) {
  const path = join("site/dist", file);
  if (!existsSync(path)) {
    failures.push(`Missing built site route: ${path}`);
  }
}

const appSource = existsSync("backend/src-hono/app.ts") ? readFileSync("backend/src-hono/app.ts", "utf8") : "";
if (!appSource.includes('app.get("/health"')) {
  failures.push("Hono app does not expose GET /health.");
}

const tasklist = existsSync("docs/astro-hono-migration-tasklist.md")
  ? readFileSync("docs/astro-hono-migration-tasklist.md", "utf8")
  : "";
if (!tasklist.includes("rollback command") && !tasklist.includes("Rollback command")) {
  failures.push("Tasklist is missing rollback command placeholders.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Migration smoke passed: static routes, SEO files, Hono health route, and rollback placeholders found.");
