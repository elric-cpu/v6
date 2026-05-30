import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSearchConsoleSitemapSubmitUrl,
  searchConsoleScope,
  submitSitemapToSearchConsole,
} from "../src/lib/search-console";

test("builds the Search Console sitemap submit endpoint", () => {
  assert.equal(
    buildSearchConsoleSitemapSubmitUrl(
      "https://bensonhomesolutions.com/",
      "https://bensonhomesolutions.com/sitemap.xml",
    ),
    "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fbensonhomesolutions.com%2F/sitemaps/https%3A%2F%2Fbensonhomesolutions.com%2Fsitemap.xml",
  );
});

test("submits the sitemap with the webmasters scope and bearer token", async () => {
  const requestedScopes: string[][] = [];
  const fetchCalls: Array<{ url: string; init: RequestInit | undefined }> = [];

  const result = await submitSitemapToSearchConsole({
    siteUrl: "https://bensonhomesolutions.com/",
    sitemapUrl: "https://bensonhomesolutions.com/sitemap.xml",
    authFactory: (scopes) => {
      requestedScopes.push(scopes);

      return {
        async getAccessToken() {
          return "access-token-123";
        },
      };
    },
    fetchImpl: async (input, init) => {
      fetchCalls.push({
        url: String(input),
        init,
      });

      return new Response("", { status: 200 });
    },
  });

  assert.deepEqual(requestedScopes, [[searchConsoleScope]]);
  assert.equal(fetchCalls.length, 1);
  assert.equal(
    fetchCalls[0]?.url,
    "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fbensonhomesolutions.com%2F/sitemaps/https%3A%2F%2Fbensonhomesolutions.com%2Fsitemap.xml",
  );
  assert.equal(fetchCalls[0]?.init?.method, "PUT");
  assert.equal(
    fetchCalls[0]?.init?.headers instanceof Headers
      ? fetchCalls[0]?.init?.headers.get("authorization")
      : (fetchCalls[0]?.init?.headers as Record<string, string> | undefined)?.authorization,
    "Bearer access-token-123",
  );
  assert.equal(result.status, 200);
});

test("fails clearly when Search Console access is denied", async () => {
  await assert.rejects(
    submitSitemapToSearchConsole({
      siteUrl: "https://bensonhomesolutions.com/",
      sitemapUrl: "https://bensonhomesolutions.com/sitemap.xml",
      authFactory: () => ({
        async getAccessToken() {
          return "access-token-123";
        },
      }),
      fetchImpl: async () =>
        new Response("Caller does not have permission", {
          status: 403,
        }),
    }),
    /denied with 403.*Caller does not have permission/i,
  );
});
