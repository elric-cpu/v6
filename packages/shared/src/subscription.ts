import { getStaticPlans } from "./public-data";

export interface SubscriptionInput {
  propertyAge: number;
  homeValue: number;
  monthlySubscription: number;
}

export function getAgeBasedRate(propertyAge: number): number {
  if (propertyAge <= 5) {
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

export function calculateEducationalAnnualSavings(input: SubscriptionInput) {
  const ageBasedRate = getAgeBasedRate(input.propertyAge);
  const annualMaintenanceCost = input.homeValue * ageBasedRate;
  const annualSubscriptionCost = input.monthlySubscription * 12;

  return {
    annualSavings: annualMaintenanceCost - annualSubscriptionCost,
    assumptions: {
      ageBasedRate,
      annualMaintenanceCost,
      annualSubscriptionCost,
      disclaimer: "Educational estimate only. This is not a guaranteed savings claim, final price, or route promise.",
    },
  };
}

export function getDefaultRecommendedPlan() {
  return getStaticPlans().find((plan) => plan.id === "standard") ?? getStaticPlans()[0];
}
