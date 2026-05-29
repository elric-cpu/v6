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
      className={`overflow-hidden rounded-lg border bg-benson-offwhite transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md ${plan.popular ? "border-benson-maroon shadow-sm" : "border-benson-pale"}`}
    >
      {plan.popular && (
        <div className="bg-benson-maroon px-4 py-2 text-center text-sm font-semibold text-benson-offwhite">
          Common Fit
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
        <p className="mb-6 text-sm text-benson-slate">
          Final fit depends on Harney County route context, photos, dimensions,
          access notes, priority level, and timing constraints.
        </p>
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
          className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-benson-maroon px-4 py-3 text-center font-medium text-benson-offwhite shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-benson-maroon-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-maroon focus-visible:ring-offset-2 active:translate-y-px"
        >
          {plan.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
