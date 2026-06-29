import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAllPublicRoutes } from "@benson/shared";

describe("Astro route parity", () => {
  it("preserves required public routes", () => {
    const routes = getAllPublicRoutes();

    for (const route of [
      "/",
      "/services",
      "/areas",
      "/resources",
      "/plans",
      "/contact",
      "/admin",
      "/how-we-work",
      "/tools/subscription-recommendation",
      "/window-screen-repair-harney-county-or",
      "/robots.txt",
      "/sitemap.xml",
      "/llms.txt",
      "/llms-full.txt",
    ]) {
      assert.ok(routes.includes(route), `${route} should be part of the public route contract`);
    }
  });
});
