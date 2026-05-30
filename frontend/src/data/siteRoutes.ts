import { resources } from "@/data/resources";
import { servicePageContentBySlug } from "@/data/servicePageContent";

export const staticSiteRoutes = [
  "/",
  "/services",
  "/about",
  "/plans",
  "/areas",
  "/how-we-work",
  "/resources",
  "/contact",
  "/privacy-policy",
  "/tools/subscription-recommendation",
  "/window-screen-repair-harney-county-or",
] as const;

export const serviceRoutes = Object.keys(servicePageContentBySlug).map((slug) => `/services/${slug}`);

export const resourceRoutes = resources.map((resource) => `/resources/${resource.slug}`);

export const areaRoutes = [
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
