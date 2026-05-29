import { recommendationPlans } from "../data/public-data.js";
import { ApiError } from "../lib/errors.js";

const propertyTypes = new Set(["residential", "commercial", "churches-nonprofits"]);
const regions = new Set(["harney-county"]);

function getAgeBasedRate(propertyAge) {
  if (propertyAge < 5) {
    return 0.01;
  }

  if (propertyAge <= 15) {
    return 0.02;
  }

  if (propertyAge <= 30) {
    return 0.03;
  }

  return 0.04;
}

function selectPlan(propertyType, squareFootage) {
  const plans = recommendationPlans[propertyType];

  if (!plans?.length) {
    throw new ApiError(400, "VALIDATION_ERROR", `Unsupported propertyType "${propertyType}".`);
  }

  if (propertyType === "residential") {
    if (squareFootage <= 1500) return plans[0];
    if (squareFootage <= 2500) return plans[1];
    if (squareFootage <= 3500) return plans[2];
    return plans[3];
  }

  if (propertyType === "commercial") {
    if (squareFootage <= 2500) return plans[0];
    if (squareFootage <= 5000) return plans[1];
    if (squareFootage <= 10000) return plans[2];
    return plans[3];
  }

  if (squareFootage <= 2500) return plans[0];
  if (squareFootage <= 5000) return plans[1];
  return plans[2];
}

function parseNumber(name, rawValue, { optional = false } = {}) {
  if ((rawValue === null || rawValue === undefined || rawValue === "") && optional) {
    return undefined;
  }

  if (rawValue === null || rawValue === undefined || rawValue === "") {
    throw new ApiError(400, "VALIDATION_ERROR", `${name} is required and must be a valid positive number.`);
  }

  const numericValue = Number(rawValue);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    throw new ApiError(400, "VALIDATION_ERROR", `${name} must be a valid positive number.`);
  }

  return numericValue;
}

export function getSubscriptionRecommendation(searchParams) {
  const propertyType = searchParams.get("propertyType");
  const region = searchParams.get("region");
  const squareFootage = parseNumber("squareFootage", searchParams.get("squareFootage"));
  const propertyAge = parseNumber("propertyAge", searchParams.get("propertyAge"));
  const homeValue = parseNumber("homeValue", searchParams.get("homeValue"), { optional: true });

  if (!propertyTypes.has(propertyType)) {
    throw new ApiError(400, "VALIDATION_ERROR", "propertyType must be residential, commercial, or churches-nonprofits.");
  }

  if (!regions.has(region)) {
    throw new ApiError(400, "VALIDATION_ERROR", "region must be harney-county.");
  }

  const recommendedPlan = selectPlan(propertyType, squareFootage);
  const ageBasedRate = getAgeBasedRate(propertyAge);
  const annualSubscriptionCost = recommendedPlan.priceMonthly * 12;
  const annualMaintenanceCost = homeValue ? Math.round(homeValue * ageBasedRate) : 0;
  const annualSavings = homeValue ? annualMaintenanceCost - annualSubscriptionCost : undefined;

  return {
    recommendedPlan,
    ...(annualSavings !== undefined ? { annualSavings } : {}),
    assumptions: {
      ageBasedRate,
      annualMaintenanceCost,
      annualSubscriptionCost,
      propertyType,
      region,
    },
    disclaimer:
      "Educational estimate only. Actual maintenance needs, project scope, response timing, and savings are not guaranteed.",
  };
}
