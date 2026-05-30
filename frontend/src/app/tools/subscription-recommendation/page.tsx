import CTAButton from "@/components/CTAButton";
import SubscriptionCalculatorForm from "@/components/SubscriptionCalculatorForm";
import { company } from "@/data/company";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(
  "Subscription Recommendation Tool",
  "Use the educational Benson Home Solutions recommendation tool to compare public maintenance plan fit by property size, age, and Harney County route context. Review the assumptions, then decide whether recurring support or a one-off repair conversation makes more sense.",
  "/tools/subscription-recommendation",
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
            This tool uses the current public API to return a plan suggestion and
            the assumptions used to calculate it. It is educational and is not a
            route, timing, price, or final-fit promise.
          </p>
        </div>
      </section>

      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SubscriptionCalculatorForm />
        </div>
      </section>

      <section className="py-16 bg-benson-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-benson-slate">
          <h2 className="text-3xl font-bold text-benson-charcoal">
            How to read the estimate
          </h2>
          <p>
            The recommendation is directional. It compares the public plan
            structure against the property inputs so you can decide whether
            recurring support or a one-off repair conversation is the better
            next step.
          </p>
          <p>
            If the result points toward a recurring plan, the next review still
            depends on access, route fit, weather exposure, and the actual
            scope. If it points toward a one-off repair, the contact page is
            where you should send photos, dimensions, and timing details.
          </p>
          <p>
            Use the tool as a planning aid, then confirm the details with the
            service area and contact pages if you want the request reviewed in
            full.
          </p>
        </div>
      </section>

      <section className="py-16 bg-benson-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-6">
            What the recommendation is based on
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-benson-charcoal">Property inputs</h3>
              <p className="mt-3 text-benson-slate">
                Square footage, property age, and property type help estimate whether recurring support or one-off work is the better fit.
              </p>
            </article>
            <article className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-benson-charcoal">Harney County context</h3>
              <p className="mt-3 text-benson-slate">
                Remote access, weather exposure, and route grouping matter because support is reviewed against actual travel and scheduling constraints.
              </p>
            </article>
            <article className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-benson-charcoal">Next step</h3>
              <p className="mt-3 text-benson-slate">
                Treat the result as planning guidance, then confirm the scope on the contact page if you want a real request reviewed.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need help interpreting the result?</h2>
          <p className="text-xl mb-8 text-benson-cream">
            Use the tool for planning, then contact us if you want to review the real property scope, route considerations, and support level.
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
