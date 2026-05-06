import test from "node:test";
import assert from "node:assert/strict";

import { createServer } from "../src/app.js";
import { publicPlans, serviceAreas, services } from "../src/data/public-data.js";

async function makeJsonRequest(server, path, options = {}) {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, options);
    const json = await response.json();
    return { response, json };
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

test("GET /health returns service health details", async () => {
  const server = createServer();
  const { response, json } = await makeJsonRequest(server, "/health");

  assert.equal(response.status, 200);
  assert.equal(json.status, "degraded");
  assert.match(json.timestamp, /\d{4}-\d{2}-\d{2}T/);
  assert.equal(typeof json.version, "string");
  assert.deepEqual(json.services, {
    database: "unhealthy",
    email: "unhealthy",
    stripe: "unhealthy",
  });
});

test("GET /health exposes safe runtime metadata without leaking secrets", async () => {
  const previousPort = process.env.PORT;
  const previousFrontendOrigin = process.env.FRONTEND_ORIGIN;
  const previousDatabaseUrl = process.env.DATABASE_URL;

  process.env.PORT = "4173";
  process.env.FRONTEND_ORIGIN = "https://bensonhomesolutions.com";
  process.env.DATABASE_URL = "postgresql://secret-user:secret-pass@db.example.com:5432/app";

  const server = createServer();

  try {
    const { response, json } = await makeJsonRequest(server, "/health");

    assert.equal(response.status, 200);
    assert.deepEqual(json.metadata, {
      frontendOrigin: "https://bensonhomesolutions.com",
      port: 4173,
    });
    assert.equal(JSON.stringify(json).includes("secret-pass"), false);
    assert.equal(JSON.stringify(json).includes("db.example.com"), false);
  } finally {
    process.env.PORT = previousPort;
    process.env.FRONTEND_ORIGIN = previousFrontendOrigin;
    process.env.DATABASE_URL = previousDatabaseUrl;
  }
});

test("GET /api/services returns active services sorted by display order", async () => {
  const server = createServer();
  const { response, json } = await makeJsonRequest(server, "/api/services");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(json.services), true);
  assert.deepEqual(
    json.services.map((service) => service.id),
    [
      "inspection-repairs",
      "water-mold-moisture",
      "window-door-replacements",
      "maintenance-plans",
      "emergency-response",
      "energy-weatherization",
      "property-preservation",
      "residential-remodeling",
      "commercial-maintenance",
      "church-nonprofit-maintenance",
    ],
  );
  assert.equal(json.services.every((service) => service.active === true), true);
  assert.equal(
    json.services.every(
      (service) =>
        service.image
        && typeof service.image.id === "string"
        && typeof service.image.src === "string"
        && service.image.src.startsWith("/site-images/"),
    ),
    true,
  );
});

test("GET /api/images returns curated public image metadata only", async () => {
  const server = createServer();
  const { response, json } = await makeJsonRequest(server, "/api/images");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(json.images), true);
  assert.equal(json.images.length >= 6, true);
  assert.equal(json.images.every((image) => typeof image.id === "string"), true);
  assert.equal(json.images.every((image) => image.src.startsWith("/site-images/")), true);
  assert.equal(json.images.every((image) => "sourceFileName" in image === false), true);
  assert.equal(
    json.images.some(
      (image) => image.serviceCategory === "window-door-replacements" && image.imageStage === "after",
    ),
    true,
  );
});

test("GET /api/plans returns active plans sorted by audience and monthly price", async () => {
  const server = createServer();
  const { response, json } = await makeJsonRequest(server, "/api/plans");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(json.plans), true);
  assert.deepEqual(
    json.plans.map((plan) => [plan.audience, plan.id]),
    [
      ["residential", "essential"],
      ["residential", "standard"],
      ["residential", "premium"],
      ["residential", "estate"],
    ],
  );
});

test("GET /api/service-areas returns all service areas sorted by priority then city", async () => {
  const server = createServer();
  const { response, json } = await makeJsonRequest(server, "/api/service-areas");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(json.areas), true);
  assert.deepEqual(
    json.areas.map((area) => [area.city, area.priority]),
    [
      ["Albany", "primary"],
      ["Burns", "primary"],
      ["Hines", "primary"],
      ["Lebanon", "primary"],
      ["Sweet Home", "primary"],
      ["Brownsville", "secondary"],
      ["Cascadia", "secondary"],
      ["Crawfordsville", "secondary"],
      ["Foster", "secondary"],
      ["Holley", "secondary"],
      ["Scio", "secondary"],
      ["Tangent", "secondary"],
      ["Crane", "route-dependent"],
      ["Diamond", "route-dependent"],
      ["Drewsey", "route-dependent"],
      ["Fields", "route-dependent"],
      ["Frenchglen", "route-dependent"],
      ["Princeton", "route-dependent"],
      ["Riley", "route-dependent"],
    ],
  );
  assert.deepEqual(
    json.areas.filter((area) => area.silo === "harney-county").map((area) => area.zipCodes[0]),
    ["97720", "97738", "97732", "97722", "97904", "97710", "97736", "97721", "97758"],
  );
});

test("GET /api/service-areas keeps remote Harney County communities route-dependent", async () => {
  const server = createServer();
  const { response, json } = await makeJsonRequest(server, "/api/service-areas");

  assert.equal(response.status, 200);
  assert.deepEqual(
    json.areas
      .filter((area) => area.silo === "harney-county" && area.priority === "route-dependent")
      .map((area) => area.city),
    ["Crane", "Diamond", "Drewsey", "Fields", "Frenchglen", "Princeton", "Riley"],
  );
  assert.equal(
    json.areas
      .filter((area) => area.silo === "harney-county" && area.priority === "route-dependent")
      .every((area) => area.localizedRisks.includes("Remote access")),
    true,
  );
});

test("GET /api/tools/subscription-recommendation returns residential recommendation and savings assumptions", async () => {
  const server = createServer();
  const { response, json } = await makeJsonRequest(
    server,
    "/api/tools/subscription-recommendation?propertyType=residential&squareFootage=2200&propertyAge=12&homeValue=450000&region=sweet-home-25-mile",
  );

  assert.equal(response.status, 200);
  assert.equal(json.recommendedPlan.id, "standard");
  assert.equal(json.assumptions.ageBasedRate, 0.02);
  assert.equal(json.assumptions.annualMaintenanceCost, 9000);
  assert.equal(json.assumptions.annualSubscriptionCost, 1788);
  assert.equal(json.assumptions.propertyType, "residential");
  assert.equal(json.assumptions.region, "sweet-home-25-mile");
  assert.equal(json.annualSavings, 7212);
  assert.match(json.disclaimer, /educational/i);
});

test("GET /api/tools/subscription-recommendation rejects zero-valued required numeric inputs", async () => {
  const server = createServer();
  const { response, json } = await makeJsonRequest(
    server,
    "/api/tools/subscription-recommendation?propertyType=residential&squareFootage=0&propertyAge=0&region=sweet-home-25-mile",
  );

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /squareFootage|propertyAge/i);
});

test("GET /api/tools/subscription-recommendation rejects missing required numeric inputs", async () => {
  const server = createServer();
  const { response, json } = await makeJsonRequest(
    server,
    "/api/tools/subscription-recommendation?propertyType=residential&region=sweet-home-25-mile",
  );

  assert.equal(response.status, 400);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /squareFootage|propertyAge/i);
});

test("GET /api/tools/subscription-recommendation rejects invalid property type with contract error shape", async () => {
  const server = createServer();
  const { response, json } = await makeJsonRequest(
    server,
    "/api/tools/subscription-recommendation?propertyType=boat&squareFootage=2200&propertyAge=12&region=sweet-home-25-mile",
  );

  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(json), ["error"]);
  assert.equal(json.error.code, "VALIDATION_ERROR");
  assert.match(json.error.message, /propertyType/i);
});

test("public content endpoints do not leak internal-only fields from source data", async () => {
  const originalServiceCost = services[0].cost;
  const originalPlanMargin = publicPlans[0].margin;
  const originalAreaAdminNotes = serviceAreas[0].adminNotes;

  services[0].cost = 1200;
  publicPlans[0].margin = 0.42;
  serviceAreas[0].adminNotes = "Internal routing detail";

  try {
    const serviceServer = createServer();
    const planServer = createServer();
    const areaServer = createServer();

    const { json: serviceJson } = await makeJsonRequest(serviceServer, "/api/services");
    const { json: planJson } = await makeJsonRequest(planServer, "/api/plans");
    const { json: areaJson } = await makeJsonRequest(areaServer, "/api/service-areas");

    assert.equal("cost" in serviceJson.services[0], false);
    assert.equal("margin" in planJson.plans[0], false);
    assert.equal("adminNotes" in areaJson.areas[0], false);
  } finally {
    if (originalServiceCost === undefined) {
      delete services[0].cost;
    } else {
      services[0].cost = originalServiceCost;
    }

    if (originalPlanMargin === undefined) {
      delete publicPlans[0].margin;
    } else {
      publicPlans[0].margin = originalPlanMargin;
    }

    if (originalAreaAdminNotes === undefined) {
      delete serviceAreas[0].adminNotes;
    } else {
      serviceAreas[0].adminNotes = originalAreaAdminNotes;
    }
  }
});
