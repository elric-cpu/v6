import CTAButton from "@/components/CTAButton";
import { company } from "@/data/company";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(
  "How We Work",
  "Learn the practical Benson Home Solutions workflow for Harney County route review: send photos, dimensions, location, access, priority, timing, and document the result.",
  "/how-we-work",
);

export default function HowWeWorkPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            How We Work
          </h1>
          <p className="text-xl text-benson-slate max-w-3xl">
            Clear scopes, clean documentation, completed work. Send photos,
            dimensions, the address or location, access notes, priority level,
            and timing constraints so the request can be reviewed for the right
            Harney County schedule.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-benson-maroon rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-benson-charcoal mb-4">
                  Send Photos & Description
                </h2>
                <p className="text-benson-slate mb-4">
                  Start by sending photos and a clear description of what you
                  need. For remote Harney County work, include:
                </p>
                <ul className="list-disc list-inside text-benson-slate space-y-2">
                  <li>Photos of the area or issue</li>
                  <li>Dimensions, counts, or rough measurements where relevant</li>
                  <li>Description of what you need done and priority level</li>
                  <li>Property address or location</li>
                  <li>Access notes, gate details, road conditions, or tenant limits</li>
                  <li>Timing constraints tied to weather, occupancy, events, or inspections</li>
                  <li>
                    Any relevant context (inspection report, previous work,
                    etc.)
                  </li>
                </ul>
                <p className="text-benson-slate mt-4">
                  You can send this via email, text, or our contact form. We&apos;ll
                  review against current Harney County scheduling and South
                  County route planning.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-benson-maroon rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-benson-charcoal mb-4">
                  Review & Scope
                </h2>
                <p className="text-benson-slate mb-4">
                  We&apos;ll review your request and provide a clear scope of work
                  when the intake details support it.
                  This includes:
                </p>
                <ul className="list-disc list-inside text-benson-slate space-y-2">
                  <li>What will be done</li>
                  <li>Materials needed</li>
                  <li>Route and timing considerations</li>
                  <li>Cost estimate</li>
                </ul>
                <p className="text-benson-slate mt-4">
                  We&#39;ll document everything so there are no surprises. If we
                  need to see the property in person, we&#39;ll review route fit
                  before scheduling a site visit.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-benson-maroon rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-benson-charcoal mb-4">
                  Schedule & Complete
                </h2>
                <p className="text-benson-slate mb-4">
                  Once you approve the scope, work is scheduled around route
                  realities, access, weather, materials, and timing constraints.
                </p>
                <ul className="list-disc list-inside text-benson-slate space-y-2">
                  <li>Clear communication about scheduling and route fit</li>
                  <li>Work completed according to scope</li>
                  <li>Progress updates as needed</li>
                  <li>Professional workmanship</li>
                </ul>
                <p className="text-benson-slate mt-4">
                  If anything changes during the work, we&#39;ll communicate it
                  before proceeding.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-benson-maroon rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">4</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-benson-charcoal mb-4">
                  Photos & Invoice
                </h2>
                <p className="text-benson-slate mb-4">
                  When the work is complete, we&apos;ll provide:
                </p>
                <ul className="list-disc list-inside text-benson-slate space-y-2">
                  <li>Completion photos showing the work</li>
                  <li>Detailed invoice with line items</li>
                  <li>Documentation of any issues found</li>
                  <li>Recommendations for future maintenance</li>
                </ul>
                <p className="text-benson-slate mt-4">
                  Clear documentation, completed work. You&#39;ll have a record of
                  everything that was done.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Review Tips */}
      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8 text-center">
            Quick Review Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Show the issue
              </h3>
              <p className="text-benson-slate">
                A clear photo with enough context usually does more than a long explanation.
              </p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Add the practical details
              </h3>
              <p className="text-benson-slate">
                Dimensions, access notes, and timing help separate urgent work from a scheduled visit.
              </p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Point to the next step
              </h3>
              <p className="text-benson-slate">
                If you already know the likely service type, mention it so the request starts in the right place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8 text-center">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Clear Communication
              </h3>
              <p className="text-benson-slate">
                Scope, access, route timing, and open questions are handled
                directly before work is scheduled.
              </p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Documented Work
              </h3>
              <p className="text-benson-slate">
                Everything is documented. Photos, invoices, and reports for your
                records.
              </p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Professional Results
              </h3>
              <p className="text-benson-slate">
                Work is framed around clear scope, practical sequencing, route
                realities, and documentation that helps the next decision-maker
                understand what was addressed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-benson-cream">
            Send photos, dimensions, address or location, access notes, priority
            level, and timing constraints. We&#39;ll review route fit and scope.
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
