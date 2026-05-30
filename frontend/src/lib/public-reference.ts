import { company, harneyCountySiloSummary } from "@/data/company";
import { resources } from "@/data/resources";
import { servicePageContentBySlug } from "@/data/servicePageContent";
import { allPublicRoutes } from "@/data/siteRoutes";

function formatList(items: readonly string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildLlmsText() {
  return [
    "# Benson Home Solutions",
    "",
    "## Business Info",
    `- Company: ${company.legalName}`,
    `- Brand: ${company.brandName}`,
    `- Oregon CCB: #${company.ccbNumber}`,
    `- Phone: ${company.phoneDisplay}`,
    `- Emergency: ${company.emergencyPhoneDisplay}`,
    `- Email: ${company.email}`,
    `- Website: ${company.siteUrl}`,
    "",
    "## Public Geography",
    harneyCountySiloSummary,
    "",
    "## Site Routes",
    formatList(allPublicRoutes),
    "",
    "## API Surface",
    formatList([
      "GET /health",
      "GET /api/services",
      "GET /api/images",
      "GET /api/plans",
      "GET /api/service-areas",
      "GET /api/tools/subscription-recommendation",
      "POST /api/leads",
      "POST /api/emergency-requests",
    ]),
    "",
    "## Service Focus",
    formatList(Object.values(servicePageContentBySlug).map((service) => `${service.title}: ${service.description}`)),
    "",
    "## Requests Should Include",
    formatList([
      "Photos of the condition",
      "Dimensions, counts, or rough measurements where relevant",
      "Address or precise location",
      "Access notes, gates, road conditions, tenant limits, or animal notes",
      "Priority level and whether the condition is active now",
      "Timing constraints tied to weather, occupancy, events, inspections, or travel",
    ]),
    "",
    "## Avoid",
    formatList([
      "Unsupported trust, ranking, credential, demand, outcome, or financial-benefit claims",
      "Generic contractor copy or unsupported response-time promises",
      "Retired non-Harney service-area positioning",
    ]),
    "",
  ].join("\n");
}

export function buildLlmsFullText() {
  return [
    "# Benson Home Solutions - Complete LLMs Context",
    "",
    "## Business Overview",
    "Benson Home Solutions is a Harney County-focused contractor providing practical repair, restoration, maintenance, screen/window/door work, property documentation, and route-aware service planning.",
    "",
    "### Legal Entity",
    `- Company: ${company.legalName}`,
    `- Brand: ${company.brandName}`,
    `- Oregon CCB: #${company.ccbNumber}`,
    `- Phone: ${company.phoneDisplay}`,
    `- Emergency Phone: ${company.emergencyPhoneDisplay}`,
    `- Email: ${company.email}`,
    `- Website: ${company.siteUrl}`,
    "",
    "## Public Site Routes",
    formatList(allPublicRoutes),
    "",
    "## Public Service Geography",
    harneyCountySiloSummary,
    "",
    "## Remote Intake Requirements",
    formatList([
      "Photos of the condition",
      "Dimensions, counts, or rough measurements where relevant",
      "Address or precise location",
      "Access notes, gates, road conditions, tenant limits, or animal notes",
      "Priority level and whether the condition is active now",
      "Timing constraints tied to weather, occupancy, events, inspections, or travel",
    ]),
    "",
    "## Core Services",
    ...Object.values(servicePageContentBySlug).flatMap((service, index) => [
      `${index + 1}. ${service.title}`,
      ...service.whatToSend.map((item) => `- ${item}`),
      ...service.scopeSections.map((section) => `- ${section.title}: ${section.items.join(", ")}`),
      "",
    ]),
    "## Resources",
    ...resources.flatMap((resource) => [
      `- ${resource.title}`,
      `  - ${resource.description}`,
      "",
    ]),
    "## Brand Voice",
    formatList([
      "Direct and clear",
      "Practical and contractor-led",
      "Documentation-focused",
      "Route-aware",
      "Specific to Harney County and South County logistics",
    ]),
    "",
    "## Avoid",
    formatList([
      "Transform your space",
      "Dream home",
      "Premier provider",
      "Top-rated unless verified",
      "Unmatched quality",
      "One-stop solution",
      "Trusted partner",
      "Fake urgency",
      "Unsupported trust, ranking, credential, demand, outcome, or financial-benefit claims",
    ]),
    "",
  ].join("\n");
}
