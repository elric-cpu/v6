import { getStaticServiceAreas, getStaticServices } from "./public-data";
import { resources } from "./resources";

export const staticSiteRoutes = [
  "/",
  "/services",
  "/about",
  "/plans",
  "/areas",
  "/how-we-work",
  "/resources",
  "/contact",
  "/admin",
  "/privacy-policy",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/llms-full.txt",
  "/tools/subscription-recommendation",
  "/window-screen-repair-harney-county-or",
] as const;

export function getAllPublicRoutes(): string[] {
  return [
    ...staticSiteRoutes,
    ...getStaticServices()
      .map((service) => service.href)
      .filter((href) => href.startsWith("/services/")),
    ...resources.map((resource) => `/resources/${resource.slug}`),
    ...getStaticServiceAreas().map((area) => `/areas/${area.id}`),
  ];
}
