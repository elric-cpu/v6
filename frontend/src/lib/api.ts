import type {
  LeadRequest,
  MaintenancePlan,
  ServiceArea,
  ServiceCard,
  SiteImage,
  ServiceSilo,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function resolveAssetUrl(src: string): string {
  if (/^https?:\/\//.test(src)) {
    return src;
  }

  if (src.startsWith("/api/")) {
    return `${API_BASE_URL}${src}`;
  }

  if (src.startsWith("/")) {
    return src;
  }

  return `${API_BASE_URL}/${src}`;
}

function normalizeImage<T extends { src: string }>(image: T): T {
  return {
    ...image,
    src: resolveAssetUrl(image.src),
  };
}

function normalizeService(service: ServiceCard): ServiceCard {
  return {
    ...service,
    ...(service.image ? { image: normalizeImage(service.image) } : {}),
  };
}

export interface SubscriptionRecommendationResult {
  recommendedPlan: MaintenancePlan;
  annualSavings?: number;
  assumptions: {
    ageBasedRate: number;
    annualMaintenanceCost: number;
    annualSubscriptionCost: number;
    propertyType: string;
    region: ServiceSilo;
  };
  disclaimer: string;
}

export interface LeadResponse {
  success: boolean;
  leadId: string;
  message: string;
  createdAt: string;
  delivery: {
    delivered: boolean;
    reason?: string;
  };
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
      throw new ApiError(
        response.status,
        error?.error?.code || "UNKNOWN",
        error?.error?.message || "Request failed"
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, "NETWORK_ERROR", "Failed to connect to the server");
  }
}

export const api = {
  async getServices(): Promise<{ services: ServiceCard[] }> {
    const data = await fetchApi<{ services: ServiceCard[] }>("/api/services");
    return {
      services: data.services.map(normalizeService),
    };
  },

  async getImages(): Promise<{ images: SiteImage[] }> {
    const data = await fetchApi<{ images: SiteImage[] }>("/api/images");
    return {
      images: data.images.map(normalizeImage),
    };
  },

  async getPlans(): Promise<{ plans: MaintenancePlan[] }> {
    return fetchApi<{ plans: MaintenancePlan[] }>("/api/plans");
  },

  async getServiceAreas(): Promise<{ areas: ServiceArea[] }> {
    return fetchApi<{ areas: ServiceArea[] }>("/api/service-areas");
  },

  async getSubscriptionRecommendation(params: {
    propertyType: "residential" | "commercial" | "churches-nonprofits";
    squareFootage: number;
    propertyAge: number;
    region: "sweet-home-25-mile" | "harney-county";
    homeValue?: number;
  }): Promise<SubscriptionRecommendationResult> {
    const searchParams = new URLSearchParams({
      propertyType: params.propertyType,
      squareFootage: params.squareFootage.toString(),
      propertyAge: params.propertyAge.toString(),
      region: params.region,
    });

    if (params.homeValue !== undefined) {
      searchParams.append("homeValue", params.homeValue.toString());
    }

    return fetchApi<SubscriptionRecommendationResult>(
      `/api/tools/subscription-recommendation?${searchParams.toString()}`
    );
  },

  async submitLeadRequest(lead: LeadRequest): Promise<LeadResponse> {
    return fetchApi<LeadResponse>("/api/leads", {
      method: "POST",
      body: JSON.stringify(lead),
    });
  },

  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return fetchApi<{ status: string; timestamp: string }>("/health");
  },
};

export { ApiError };
