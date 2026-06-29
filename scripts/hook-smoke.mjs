import { accessSync, constants, existsSync, readFileSync } from "node:fs";

const configs = [".codex/hooks.json", ".claude/settings.local.json"];
const requiredScripts = [
  "scripts/hooks/pre-tool.sh",
  "scripts/hooks/post-tool.sh",
  "scripts/hooks/session-start.sh",
  "scripts/hooks/session-end.sh",
];

for (const configPath of configs) {
  if (!existsSync(configPath)) {
    continue;
  }

  const config = readFileSync(configPath, "utf8");

  if (config.includes("/home/elric/.codex/skills/self-improving-agent")) {
    throw new Error(`${configPath} still points at global self-improving-agent hooks.`);
  }

  for (const scriptPath of requiredScripts) {
    if (!config.includes(scriptPath)) {
      throw new Error(`${configPath} does not reference ${scriptPath}.`);
    }
  }
}

for (const scriptPath of requiredScripts) {
  accessSync(scriptPath, constants.R_OK);
}

console.log("Hook smoke check passed.");
