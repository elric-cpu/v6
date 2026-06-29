export type ServiceType =
  | "inspection-repairs"
  | "water-mold-moisture"
  | "window-door-replacements"
  | "maintenance-plans"
  | "emergency-response"
  | "energy-weatherization"
  | "property-preservation"
  | "residential-remodeling"
  | "commercial-maintenance"
  | "church-nonprofit-maintenance";

export type ServiceSilo = "harney-county";

export interface SiteImage {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  serviceCategory?: ServiceType;
  imageStage?: "before" | "during" | "after" | "general" | "needs-review";
}

export interface ServiceCard {
  id: string;
  title: string;
  summary: string;
  href: string;
  ctaLabel: string;
  serviceType: ServiceType;
  image?: SiteImage;
  tags?: string[];
  displayOrder?: number;
  active: boolean;
}

export interface ServiceAreaLink {
  label: string;
  href: string;
  serviceType: ServiceType;
}

export interface ServiceArea {
  id: string;
  city: string;
  zipCodes: string[];
  silo: ServiceSilo;
  priority: "primary" | "secondary" | "route-dependent";
  regionLabel: string;
  localizedRisks: string[];
  services: ServiceAreaLink[];
}

export interface MaintenancePlan {
  id: string;
  name: string;
  priceMonthly: number;
  squareFootageRange?: string;
  description: string;
  features: string[];
  popular?: boolean;
  audience: "residential" | "commercial" | "churches-nonprofits";
  ctaLabel: string;
  active: boolean;
}

export interface LeadRequest {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  serviceType: ServiceType;
  message: string;
  urgency: "standard" | "soon" | "emergency";
  sourcePage?: string;
  turnstileToken?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ProviderStatus = "healthy" | "disabled" | "unhealthy";

export interface IntegrationHealth {
  status: ProviderStatus;
  provider: string | null;
  owner: string;
  requiredConfig: string[];
  failureMode: string;
  verificationCommand: string;
}
