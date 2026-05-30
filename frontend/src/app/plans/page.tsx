import Link from "next/link";
import MaintenancePlanCard from "@/components/MaintenancePlanCard";
import FAQ from "@/components/FAQ";
import CTAButton from "@/components/CTAButton";
import { api } from "@/lib/api";
import { buildPageMetadata } from "@/lib/metadata";
import { company } from "@/data/company";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata(
  "Maintenance Plans",
  "Review public maintenance plan tiers and use the educational recommendation tool to compare support levels for Harney County residential and facility properties.",
  "/plans",
);

export default async function PlansPage() {
  const { plans } = await api.getPlans();

  const residentialFAQs = [
    {
      question: "What is included in a maintenance plan?",
      answer:
        "Each public plan outlines a maintenance level, recurring inspection rhythm, and documented follow-through. Final fit still depends on the property and the actual scope needs.",
    },
    {
      question: "How often do you visit?",
      answer:
        "Visit frequency depends on the plan tier and the property. The public plan descriptions are meant to explain support level, not to replace final scheduling confirmation.",
    },
    {
      question: "Do commercial or church properties use the same pricing table?",
      answer:
        "Not necessarily. This page currently publishes residential plan tiers. Commercial and church/non-profit support should be reviewed directly against the property and scope.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            Maintenance Plans
          </h1>
          <p className="text-xl text-benson-slate max-w-3xl">
            Scheduled maintenance for Harney County properties. Clear scopes,
            documented work, and monthly South County route planning where the
            scope, access, weather, and timing fit.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-bold text-benson-charcoal mb-3">
              Plan Options
            </h2>
            <p className="text-benson-slate">
              Review the public tiers first, then compare support level, property context, and route fit before you decide whether to request a plan conversation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <MaintenancePlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <div>
              <h2 className="text-3xl font-bold text-benson-charcoal mb-8">
                How Maintenance Plans Work
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border border-benson-pale rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                    1. Choose the support level
                  </h3>
                  <p className="text-benson-slate">
                    Start with the property size and the level of scheduled oversight you want documented through the year.
                  </p>
                </div>
                <div className="bg-white border border-benson-pale rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                    2. Use the estimator carefully
                  </h3>
                  <p className="text-benson-slate">
                    The recommendation tool returns an educational plan suggestion and the assumptions used to calculate it. It does not promise price, timing, route placement, or final fit.
                  </p>
                </div>
                <div className="bg-white border border-benson-pale rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                    3. Confirm the real fit
                  </h3>
                  <p className="text-benson-slate">
                    Final fit depends on property condition, Harney County route context, support level, access notes, priority, and whether the work is better handled as one-off scope instead.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Related next step
              </h3>
              <p className="text-benson-slate mb-4">
                Use the educational recommendation tool if you want to compare property age, Harney County route context, and support level before reaching out.
              </p>
              <Link
                href="/tools/subscription-recommendation"
                className="inline-block rounded bg-benson-maroon px-4 py-2 text-white transition-colors hover:bg-benson-maroon-dark"
              >
                Open the tool
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <FAQ items={residentialFAQs} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-benson-cream">
            Contact us with photos, dimensions, address or location, access notes,
            priority level, and timing constraints to review whether a plan or a
            one-off route scope makes more sense.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/contact" size="lg" className="bg-white !text-benson-charcoal hover:bg-benson-cream">
              Contact Us
            </CTAButton>
            <a
              href={company.phoneHref}
              className="inline-block rounded bg-benson-maroon-dark px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-benson-wine"
            >
              {company.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
