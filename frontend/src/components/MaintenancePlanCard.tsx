import Link from "next/link";
import { MaintenancePlan as MaintenancePlanType } from "@/types";

interface MaintenancePlanCardProps {
  plan: MaintenancePlanType;
}

export default function MaintenancePlanCard({
  plan,
}: MaintenancePlanCardProps) {
  return (
    <div
      className={`bg-white border rounded-lg overflow-hidden ${plan.popular ? "border-benson-maroon shadow-lg" : "border-benson-pale"}`}
    >
      {plan.popular && (
        <div className="bg-benson-maroon text-white text-center py-2 text-sm font-semibold">
          Most Popular
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-benson-charcoal mb-1">
          {plan.name}
        </h3>
        {plan.squareFootageRange && (
          <p className="text-benson-slate text-sm mb-4">
            {plan.squareFootageRange}
          </p>
        )}
        <div className="mb-4">
          <span className="text-4xl font-bold text-benson-charcoal">
            ${plan.priceMonthly}
          </span>
          <span className="text-benson-slate">/month</span>
        </div>
        <p className="text-benson-slate mb-6">{plan.description}</p>
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start text-sm text-benson-slate"
            >
              <svg
                className="w-5 h-5 text-benson-maroon mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href="/contact"
          className="block w-full text-center bg-benson-maroon hover:bg-benson-maroon-dark text-white px-4 py-3 rounded transition-colors"
        >
          {plan.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
