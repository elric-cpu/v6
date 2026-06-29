import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const mode = process.argv.includes("--write") ? "write" : "check";
const roots = [
  "backend/src",
  "backend/src-hono",
  "backend/test",
  "backend/test-hono",
  "frontend/src",
  "site/src",
  "site/test",
  "packages/shared/src",
  "packages/shared/test",
  "docs",
  "scripts",
];
const extensions = new Set([".js", ".mjs", ".ts", ".tsx", ".json", ".md", ".yml"]);

function extensionOf(filePath) {
  const match = filePath.match(/\.[^.]+$/);
  return match?.[0] ?? "";
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return walk(path);
    }

    return extensions.has(extensionOf(path)) ? [path] : [];
  });
}

function normalize(content) {
  return `${content.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").replace(/\n*$/u, "")}\n`;
}

const changed = [];

for (const filePath of roots.flatMap(walk)) {
  const current = readFileSync(filePath, "utf8");
  const formatted = normalize(current);

  if (current !== formatted) {
    changed.push(filePath);

    if (mode === "write") {
      writeFileSync(filePath, formatted);
    }
  }
}

if (changed.length > 0 && mode === "check") {
  console.error(`Formatting check failed:\n${changed.map((file) => `- ${file}`).join("\n")}`);
  process.exit(1);
}

console.log(mode === "write" ? `Formatted ${changed.length} file(s).` : "Formatting check passed.");
