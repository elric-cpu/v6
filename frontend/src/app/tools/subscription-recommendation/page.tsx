import CTAButton from "@/components/CTAButton";
import SubscriptionCalculatorForm from "@/components/SubscriptionCalculatorForm";
import { company } from "@/data/company";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(
  "Subscription Recommendation Tool",
  "Use the educational Benson Home Solutions subscription recommendation tool to compare public maintenance plan fit by property size, age, and region.",
);

export default function SubscriptionRecommendationPage() {
  return (
    <>
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            Subscription Recommendation Tool
          </h1>
          <p className="text-xl text-benson-slate max-w-3xl">
            This estimator uses the current public API to return a recommended plan and the assumptions used to calculate it. It is educational and not a guarantee of savings or final fit.
          </p>
        </div>
      </section>

      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SubscriptionCalculatorForm />
        </div>
      </section>

      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need help interpreting the result?</h2>
          <p className="text-xl mb-8 text-benson-cream">
            Use the tool for planning, then contact us if you want to review the real property scope, route considerations, and support level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/contact" size="lg" className="bg-white text-benson-charcoal hover:bg-benson-cream">
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
