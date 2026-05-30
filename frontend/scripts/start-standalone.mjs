import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function findStandaloneServer(currentDir) {
  const rootServer = path.join(currentDir, "server.js");
  if (fs.existsSync(rootServer)) {
    return rootServer;
  }

  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "node_modules") {
      continue;
    }

    const found = findStandaloneServer(path.join(currentDir, entry.name));
    if (found) {
      return found;
    }
  }

  return null;
}

const standaloneRoot = path.join(process.cwd(), ".next", "standalone");
const serverPath = findStandaloneServer(standaloneRoot);

if (!serverPath) {
  console.error(`Could not find a standalone server.js under ${standaloneRoot}. Run npm run build first.`);
  process.exit(1);
}

const child = spawn(process.execPath, [serverPath], {
  env: process.env,
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});
