import type { ServiceArea, ServiceCard } from "@/types";
import { servicePageContentBySlug, serviceSlugByType } from "@/data/servicePageContent";

export function getServiceSlugFromHref(href: string): string | null {
  const match = href.match(/^\/services\/(.+)$/);
  return match ? match[1] : null;
}

export function getServiceBySlug(
  services: ServiceCard[],
  slug: string,
): ServiceCard | undefined {
  return services.find((service) => getServiceSlugFromHref(service.href) === slug);
}

export function getAreaById(areas: ServiceArea[], areaId: string): ServiceArea | undefined {
  return areas.find((area) => area.id === areaId);
}

export function groupAreasBySilo(areas: ServiceArea[]) {
  return {
    harneyCounty: areas.filter((area) => area.silo === "harney-county"),
  };
}

export function getServiceSlugsFromContent(): string[] {
  return Object.keys(servicePageContentBySlug);
}

export function getCanonicalServiceSlugForType(serviceType: ServiceCard["serviceType"]) {
  return serviceSlugByType[serviceType];
}
