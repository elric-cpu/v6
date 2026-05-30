import { resources } from "@/data/resources";
import { servicePageContentBySlug } from "@/data/servicePageContent";

const staticSiteRoutes = [
  "/",
  "/services",
  "/about",
  "/plans",
  "/areas",
  "/how-we-work",
  "/resources",
  "/contact",
  "/privacy-policy",
  "/llms.txt",
  "/llms-full.txt",
  "/tools/subscription-recommendation",
  "/window-screen-repair-harney-county-or",
] as const;

const serviceRoutes = Object.keys(servicePageContentBySlug).map((slug) => `/services/${slug}`);

const resourceRoutes = resources.map((resource) => `/resources/${resource.slug}`);

const areaRoutes = [
  "/areas/burns",
  "/areas/hines",
  "/areas/crane",
  "/areas/diamond",
  "/areas/drewsey",
  "/areas/fields",
  "/areas/frenchglen",
  "/areas/lawen",
  "/areas/princeton",
  "/areas/riley",
] as const;

export const allPublicRoutes = [
  ...staticSiteRoutes,
  ...serviceRoutes,
  ...resourceRoutes,
  ...areaRoutes,
] as const;
