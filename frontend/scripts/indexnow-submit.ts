import { company } from "../src/data/company";
import { allPublicRoutes } from "../src/data/siteRoutes";

const indexNowKey = "c31e7f3b1dda4c72beb68ec70efaf085";
const indexNowEndpoint = "https://api.indexnow.org/indexnow";

function getKeyLocation() {
  return `${company.siteUrl}/${indexNowKey}.txt`;
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function submitBatch(urlList: string[]) {
  const response = await fetch(indexNowEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host: new URL(company.siteUrl).host,
      key: indexNowKey,
      keyLocation: getKeyLocation(),
      urlList,
    }),
  });

  const responseText = await response.text().catch(() => "");

  return {
    ok: response.ok,
    status: response.status,
    responseText,
  };
}

async function main() {
  const urls = allPublicRoutes.map((pathname) => `${company.siteUrl}${pathname}`);
  const batches = chunk(urls, 1000);

  console.log(`Submitting ${urls.length} URLs to IndexNow from ${getKeyLocation()}`);

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index];
    const result = await submitBatch(batch);
    console.log(
      `Batch ${index + 1}/${batches.length}: ${result.status} ${result.ok ? "ok" : "failed"}`,
    );

    if (!result.ok) {
      const message = result.responseText.trim();
      throw new Error(
        message.length > 0
          ? `IndexNow submission failed with ${result.status}: ${message}`
          : `IndexNow submission failed with ${result.status}`,
      );
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
