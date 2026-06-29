import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  calculateEducationalAnnualSavings,
  company,
  getAgeBasedRate,
  getAllPublicRoutes,
  getStaticServiceAreas,
  getStaticServices,
  resources,
} from "../src/index";

describe("shared public contracts", () => {
  it("keeps Harney County public service geography", () => {
    const areas = getStaticServiceAreas();
    assert.equal(company.serviceRegion, "Harney County");
    assert.deepEqual(
      areas.map((area) => area.id).sort(),
      ["burns", "crane", "diamond", "drewsey", "fields", "frenchglen", "hines", "lawen", "princeton", "riley"].sort(),
    );
  });

  it("keeps window and door replacement as a dedicated service", () => {
    const services = getStaticServices();
    assert.ok(services.some((service) => service.serviceType === "window-door-replacements"));
  });

  it("generates route parity for key SEO surfaces", () => {
    const routes = getAllPublicRoutes();
    for (const route of [
      "/",
      "/services",
      "/areas",
      "/resources",
      "/robots.txt",
      "/sitemap.xml",
      "/llms.txt",
      "/llms-full.txt",
    ]) {
      assert.ok(routes.includes(route), `${route} should be present`);
    }
  });

  it("keeps the current public resource route set", () => {
    assert.deepEqual(
      resources.map((resource) => resource.slug).sort(),
      [
        "harney-county-routes-and-south-county-planning",
        "maintenance-plans-vs-one-off-repairs",
        "send-photos-address-and-scope",
      ],
    );
  });

  it("uses the educational subscription assumptions", () => {
    assert.equal(getAgeBasedRate(4), 0.01);
    assert.equal(getAgeBasedRate(12), 0.02);
    assert.equal(getAgeBasedRate(24), 0.03);
    assert.equal(getAgeBasedRate(31), 0.04);

    const result = calculateEducationalAnnualSavings({
      propertyAge: 31,
      homeValue: 300000,
      monthlySubscription: 149,
    });

    assert.equal(result.assumptions.annualMaintenanceCost, 12000);
    assert.equal(result.assumptions.annualSubscriptionCost, 1788);
    assert.match(result.assumptions.disclaimer, /not a guaranteed savings/i);
  });
});
