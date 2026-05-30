import { spawn } from "node:child_process";
import { submitSitemapToSearchConsole } from "../src/lib/search-console";

const defaults = {
  project: "civic-wall-494004-b3",
  region: "us-west1",
  service: "benson-website-v6",
  serviceAccount: "1048944000089-compute@developer.gserviceaccount.com",
  apiBaseUrl: "https://benson-api-v6-ecdo5oua2a-uw.a.run.app",
  nextPublicApiUrl: "https://benson-api-v6-ecdo5oua2a-uw.a.run.app",
  nextPublicGaMeasurementId: "G-RLQ31P5HD0",
  nextPublicGscVerification: "BZhBkLGmJPNnDGbiCFGp9Z-FnZTt5XhAuNPIKtdjv2o",
  nextPublicGtmId: "GTM-TTZ2Z92K",
};

function run(command: string, args: string[], options: { cwd: string }) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: "inherit",
      shell: false,
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal
            ? `${command} exited with signal ${signal}`
            : `${command} exited with code ${code ?? "unknown"}`,
        ),
      );
    });
  });
}

async function main() {
  const cwd = process.cwd();

  const project = process.env.GCP_PROJECT ?? defaults.project;
  const region = process.env.GCP_REGION ?? defaults.region;
  const service = process.env.GCP_SERVICE ?? defaults.service;
  const serviceAccount = process.env.GCP_SERVICE_ACCOUNT ?? defaults.serviceAccount;
  const apiBaseUrl = process.env.API_BASE_URL ?? defaults.apiBaseUrl;
  const nextPublicApiUrl = process.env.NEXT_PUBLIC_API_URL ?? defaults.nextPublicApiUrl;
  const nextPublicGaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? defaults.nextPublicGaMeasurementId;
  const nextPublicGscVerification =
    process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? defaults.nextPublicGscVerification;
  const nextPublicGtmId = process.env.NEXT_PUBLIC_GTM_ID ?? defaults.nextPublicGtmId;

  const envVars = [
    `API_BASE_URL=${apiBaseUrl}`,
    `NEXT_PUBLIC_API_URL=${nextPublicApiUrl}`,
    `NEXT_PUBLIC_GA_MEASUREMENT_ID=${nextPublicGaMeasurementId}`,
    `NEXT_PUBLIC_GSC_VERIFICATION=${nextPublicGscVerification}`,
    `NEXT_PUBLIC_GTM_ID=${nextPublicGtmId}`,
  ].join(",");

  const deployArgs = [
    "run",
    "deploy",
    service,
    "--source",
    ".",
    "--region",
    region,
    "--project",
    project,
    "--platform",
    "managed",
    "--allow-unauthenticated",
    "--service-account",
    serviceAccount,
    "--set-env-vars",
    envVars,
  ];

  console.log(`Deploying ${service} to Cloud Run in ${region}...`);
  await run("gcloud", deployArgs, { cwd });

  console.log("Submitting current public URLs to IndexNow...");
  await run("npm", ["run", "indexnow:submit"], { cwd });

  console.log("Submitting sitemap to Google Search Console...");
  const searchConsoleResult = await submitSitemapToSearchConsole();
  console.log(`Search Console sitemap submission complete: ${searchConsoleResult.status} ok`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
