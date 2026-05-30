import { baseServicePageContentBySlug } from "@/data/servicePageContent.base";
import { extraServicePageContentBySlug } from "@/data/servicePageContent.extra";
import type { ServiceType } from "@/types";

export interface ServicePageSection {
  title: string;
  items: string[];
}

export interface ServicePageContent {
  slug: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  heroSummary: string;
  situation: string[];
  whatToSend: string[];
  scopeSections: ServicePageSection[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  finalCtaTitle: string;
  finalCtaText: string;
}

export const serviceSlugByType: Record<ServiceType, string> = {
  "inspection-repairs": "inspection-repairs",
  "water-mold-moisture": "water-damage",
  "window-door-replacements": "window-door-replacement",
  "maintenance-plans": "plans",
  "emergency-response": "emergency-response",
  "energy-weatherization": "energy-weatherization",
  "property-preservation": "property-preservation",
  "residential-remodeling": "residential-remodeling",
  "commercial-maintenance": "commercial-maintenance",
  "church-nonprofit-maintenance": "church-nonprofit-maintenance",
};

export const servicePageContentBySlug: Record<string, ServicePageContent> = {
  ...baseServicePageContentBySlug,
  ...extraServicePageContentBySlug,
};

export function getServiceContentBySlug(slug: string): ServicePageContent | undefined {
  return servicePageContentBySlug[slug];
}
