// Service Types
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

export type ServiceSilo = "sweet-home-25-mile" | "harney-county";

// Image Types
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

// Service Card
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

// Service Area
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

// Maintenance Plans
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

// Lead Request
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
}

// Subscription Calculator
export interface SubscriptionCalculatorInput {
  propertyType: "residential" | "commercial" | "churches-nonprofits";
  squareFootage: number;
  propertyAge: number;
  homeValue?: number;
  region: ServiceSilo;
  riskFactors?: string[];
}

export interface SubscriptionCalculatorResult {
  recommendedPlan: MaintenancePlan;
  annualSavings?: number;
  assumptions: {
    ageBasedRate: number;
    annualMaintenanceCost: number;
    annualSubscriptionCost: number;
  };
}

// Church Assessment
export interface ChurchAssessmentZone {
  zone: "sanctuary" | "fellowship" | "systems" | "grounds" | "safety";
  score: number;
  issues: string[];
  recommendations: string[];
}

export interface ChurchAssessmentReport {
  stewardshipScore: number;
  ministryRiskLevel: "low" | "medium" | "high";
  zones: ChurchAssessmentZone[];
  volunteerTasks: string[];
  professionalTasks: string[];
  budgetProjection: {
    year1: number;
    year2: number;
    year3: number;
  };
}

// Commercial Health Score
export interface CommercialHealthScore {
  overallScore: number;
  categories: {
    structural: number;
    systems: number;
    safety: number;
    efficiency: number;
  };
  urgentIssues: string[];
  recommendedActions: string[];
  oregonAdjustments: {
    freezeRisk: number;
    seismicRisk: number;
  };
}
