import test from "node:test";
import assert from "node:assert/strict";

import { services as backendServices, serviceAreas as backendAreas } from "../../backend/src/data/public-data.js";
import { buildVerificationMetadata } from "../src/lib/metadata";
import { getCanonicalServiceSlugForType, getServiceSlugFromHref, groupAreasBySilo } from "../src/lib/content";
import { resourceBySlug, resources } from "../src/data/resources";
import { getServiceContentBySlug } from "../src/data/servicePageContent";

test("backend service hrefs align with frontend service content slugs", () => {
  const serviceRoutes = backendServices.filter((service) => service.href.startsWith("/services/"));

  assert.equal(serviceRoutes.length > 0, true);

  for (const service of serviceRoutes) {
    const hrefSlug = getServiceSlugFromHref(service.href);
    assert.equal(hrefSlug, getCanonicalServiceSlugForType(service.serviceType));
    assert.equal(Boolean(hrefSlug && getServiceContentBySlug(hrefSlug)), true);
  }
});

test("backend service-area links only reference known public routes", () => {
  for (const area of backendAreas) {
    for (const service of area.services) {
      if (service.href === "/plans") {
        continue;
      }

      const hrefSlug = getServiceSlugFromHref(service.href);
      assert.equal(Boolean(hrefSlug && getServiceContentBySlug(hrefSlug)), true);
    }
  }
});

test("service areas group cleanly into the two supported silos", () => {
  const grouped = groupAreasBySilo(backendAreas);

  assert.equal(grouped.sweetHome.length > 0, true);
  assert.equal(grouped.harneyCounty.length > 0, true);
  assert.equal(
    grouped.harneyCounty.every((area) => area.silo === "harney-county"),
    true,
  );
});

test("resource library exposes unique, routable entries", () => {
  assert.equal(resources.length >= 3, true);

  const uniqueSlugs = new Set(resources.map((resource) => resource.slug));
  assert.equal(uniqueSlugs.size, resources.length);

  for (const resource of resources) {
    assert.equal(resourceBySlug[resource.slug]?.title, resource.title);
    assert.equal(resource.sections.length > 0, true);
  }
});

test("verification metadata stays empty when verification env vars are unset", () => {
  const previousGoogle = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
  const previousBing = process.env.NEXT_PUBLIC_BING_VERIFICATION;

  delete process.env.NEXT_PUBLIC_GSC_VERIFICATION;
  delete process.env.NEXT_PUBLIC_BING_VERIFICATION;

  try {
    assert.deepEqual(buildVerificationMetadata(), {});
  } finally {
    process.env.NEXT_PUBLIC_GSC_VERIFICATION = previousGoogle;
    process.env.NEXT_PUBLIC_BING_VERIFICATION = previousBing;
  }
});
