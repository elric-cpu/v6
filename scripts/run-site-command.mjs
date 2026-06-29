import { spawnSync } from "node:child_process";

const command = process.argv[2];
const args = process.argv.slice(3);

if (!command) {
  console.error("Usage: node scripts/run-site-command.mjs <npm-script> [args...]");
  process.exit(1);
}

function nodeSupportsAstro() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  return major > 22 || (major === 22 && minor >= 12);
}

const scriptArgs = ["run", command, ...args];
const result = nodeSupportsAstro()
  ? spawnSync("npm", scriptArgs, { cwd: "site", stdio: "inherit" })
  : spawnSync(
      "npx",
      ["-y", "-p", "node@22", "-c", `cd site && npm ${scriptArgs.join(" ")}`],
      { stdio: "inherit" },
    );

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
