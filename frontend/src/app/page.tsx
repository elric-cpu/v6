import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import ServiceCard from "@/components/ServiceCard";
import FAQ from "@/components/FAQ";
import { api } from "@/lib/api";
import { company } from "@/data/company";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [servicesData, plansData, serviceAreas] = await Promise.all([
    api.getServices(),
    api.getPlans(),
    api.getServiceAreas(),
  ]);
  const services = servicesData.services;
  const plans = plansData.plans;

  const residentialFAQs = [
    {
      question: "What areas do you serve?",
      answer:
        "The active coverage model uses two silos: a practical 25-mile radius around Sweet Home and a route-dependent Harney County footprint for remote communities.",
    },
    {
      question: "What helps the first review move faster?",
      answer:
        "Photos of the condition, the property address, the best callback number, and any timing or access limits usually make the first scope review much clearer.",
    },
    {
      question: "How do maintenance plans work?",
      answer:
        "Maintenance plans are a public-facing support model for scheduled property care. They are educational until the actual property, support level, and region are reviewed.",
    },
  ];

  const heroImage =
    services.find((service) => service.id === "window-door-replacements")?.image
    ?? services.find((service) => service.image)?.image
    ?? null;

  return (
    <>
      <section className="bg-benson-cream py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-benson-charcoal mb-6">
                Practical Repair, Restoration & Maintenance
              </h1>
              <p className="text-xl text-benson-slate mb-8">
                Clear scopes, clean documentation, completed work. Serving Sweet
                Home, Lebanon, Albany, and Harney County.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <CTAButton href="/services" size="lg">
                  See What We Do
                </CTAButton>
                <CTAButton href="/plans" variant="secondary" size="lg">
                  View Maintenance Plans
                </CTAButton>
              </div>
            </div>
            {heroImage && (
              <div className="relative overflow-hidden rounded-3xl border border-benson-pale bg-white shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="border-t border-benson-pale bg-white/95 px-5 py-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-benson-maroon">
                    Real Project Photo
                  </p>
                  <p className="mt-1 text-sm text-benson-slate">
                    {heroImage.caption ?? "Work documented with clear before, during, and after context."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-benson-charcoal mb-4">
              Our Services
            </h2>
            <p className="text-benson-slate max-w-2xl mx-auto">
              Practical solutions for Oregon properties. From inspection repairs
              to maintenance plans, we document everything.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="text-benson-maroon hover:text-benson-maroon-dark font-medium"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-benson-charcoal mb-4">
              Maintenance Plans
            </h2>
            <p className="text-benson-slate max-w-2xl mx-auto">
              Scheduled support for properties that need documented upkeep, recurring inspections, and a more consistent maintenance rhythm.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-benson-pale rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-benson-charcoal mb-1">
                  {plan.name}
                </h3>
                {plan.squareFootageRange && (
                  <p className="text-benson-slate text-sm mb-2">
                    {plan.squareFootageRange}
                  </p>
                )}
                <div className="mb-4">
                  <span className="text-3xl font-bold text-benson-charcoal">
                    ${plan.priceMonthly}
                  </span>
                  <span className="text-benson-slate">/month</span>
                </div>
                <p className="text-benson-slate text-sm mb-4">
                  {plan.description}
                </p>
                <Link
                  href="/plans"
                  className="block w-full text-center bg-benson-maroon hover:bg-benson-maroon-dark text-white px-4 py-2 rounded transition-colors text-sm"
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-benson-charcoal mb-4">
              How We Work
            </h2>
            <p className="text-benson-slate max-w-2xl mx-auto">
              A clear process from start to finish. Send the list, send the
              photos, text the address.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Send Photos
              </h3>
              <p className="text-benson-slate text-sm">
                Send photos and a description of what you need. We&apos;ll review and
                provide initial feedback.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Review & Scope
              </h3>
              <p className="text-benson-slate text-sm">
                We&apos;ll review your request, provide a clear scope, and document what
                needs to be done.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Schedule & Complete
              </h3>
              <p className="text-benson-slate text-sm">
                We&apos;ll schedule the work, complete it according to the scope, and
                document progress.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Photos & Invoice
              </h3>
              <p className="text-benson-slate text-sm">
                We&apos;ll provide completion photos and a detailed invoice. Clear
                documentation, completed work.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-benson-charcoal mb-4">
              Service Areas
            </h2>
            <p className="text-benson-slate max-w-2xl mx-auto">
              Serving Sweet Home, Lebanon, Albany, and nearby communities within
              roughly 25 miles of Sweet Home. Also serving Harney County.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceAreas.areas.slice(0, 8).map((area) => (
              <Link
                key={area.id}
                href={`/areas/${area.id}`}
                className="bg-white border border-benson-pale rounded-lg p-4 text-center hover:border-benson-maroon transition-colors"
              >
                <span className="text-benson-charcoal font-medium">{area.city}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/areas"
              className="text-benson-maroon hover:text-benson-maroon-dark font-medium"
            >
              View All Service Areas →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-benson-pale bg-white p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-benson-maroon">
                Resources
              </p>
              <h2 className="mt-3 text-3xl font-bold text-benson-charcoal">
                Practical guidance before you request work
              </h2>
              <p className="mt-3 text-benson-slate">
                Review what to send before requesting a scope, how service areas are handled, and how to think about plans versus one-off repair work.
              </p>
              <div className="mt-6">
                <CTAButton href="/resources">Browse Resources</CTAButton>
              </div>
            </div>
            <div className="rounded-3xl border border-benson-pale bg-benson-cream p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-benson-maroon">
                Tools
              </p>
              <h2 className="mt-3 text-3xl font-bold text-benson-charcoal">
                Use the subscription recommendation tool carefully
              </h2>
              <p className="mt-3 text-benson-slate">
                The current estimator returns a recommended public plan plus the assumptions used. It is educational and should not be read as a guarantee.
              </p>
              <div className="mt-6">
                <CTAButton href="/tools/subscription-recommendation">
                  Open the Tool
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-benson-charcoal mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <FAQ items={residentialFAQs} />
        </div>
      </section>

      <section className="py-20 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-benson-cream">
            Send the list, send the photos, text the address. We&apos;ll review and
            provide a clear scope.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              href="/contact"
              size="lg"
              className="bg-white text-benson-charcoal hover:bg-benson-cream"
            >
              Contact Us
            </CTAButton>
            <a
              href={company.phoneHref}
              className="inline-block bg-benson-maroon-dark hover:bg-benson-wine text-white px-6 py-3 rounded transition-colors text-lg font-medium"
            >
              {company.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
