import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import ServiceCard from "@/components/ServiceCard";
import FAQ from "@/components/FAQ";
import { homePageFAQs } from "@/data/homePageContent";
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
  const harneyAreas = serviceAreas.areas.filter((area) => area.silo === "harney-county");

  const heroImage =
    services.find((service) => service.id === "window-door-replacements")?.image
    ?? services.find((service) => service.image)?.image
    ?? null;

  return (
    <>
      <section className="bg-benson-cream py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-benson-charcoal mb-6">
                Benson Home Solutions Repair & Maintenance
              </h1>
              <p className="text-xl leading-relaxed text-benson-slate mb-8">
                Clear scopes and documented work for Harney County properties,
                with monthly South County routes planned from photos,
                dimensions, access notes, and timing constraints.
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
              <div className="relative overflow-hidden rounded-lg border border-benson-pale bg-benson-offwhite shadow-sm">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    width={heroImage.width ?? 1200}
                    height={heroImage.height ?? 1600}
                    priority
                    quality={60}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="border-t border-benson-pale bg-benson-offwhite/95 px-4 py-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-benson-maroon">
                    Window & Door Work
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
              Practical solutions for Harney County properties. From inspection
              repairs to route-planned maintenance, we document what is reviewed,
              scoped, scheduled, and completed.
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
              Scheduled support for Harney County properties that need documented
              upkeep, recurring inspections, and planned monthly South County
              route review.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-lg border border-benson-pale bg-benson-offwhite p-6 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-benson-burgundy hover:shadow-md"
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
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-benson-maroon px-4 py-2 text-center text-sm font-medium text-benson-offwhite shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-benson-maroon-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-maroon focus-visible:ring-offset-2 active:translate-y-px"
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
              A clear route-aware process from intake to documentation. Send the
              photos, dimensions, address or location, access notes, priority
              level, and timing constraints.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-benson-offwhite">1</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Send Photos
              </h3>
              <p className="text-benson-slate text-sm">
                Send photos, dimensions, the property location, access notes,
                priority level, and timing constraints.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-benson-offwhite">2</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Review & Scope
              </h3>
              <p className="text-benson-slate text-sm">
                We review the request against current Harney County routing,
                including monthly South County route fit where applicable.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-benson-offwhite">3</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Schedule & Complete
              </h3>
              <p className="text-benson-slate text-sm">
                Work is scheduled around route realities, weather, access,
                materials, and the documented scope.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-benson-offwhite">4</span>
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
              Harney County Routes
            </h2>
            <p className="text-benson-slate max-w-2xl mx-auto">
              Serving Burns, Hines, Crane, Drewsey, Frenchglen, Fields, Diamond,
              Princeton, Riley, Lawen, and remote South County communities through
              planned, route-aware scheduling.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {harneyAreas.map((area) => (
              <Link
                key={area.id}
                href={`/areas/${area.id}`}
                className="rounded-lg border border-benson-pale bg-benson-offwhite p-4 text-center transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-benson-maroon hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-maroon focus-visible:ring-offset-2"
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
              View Harney County Routes →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="min-w-0 rounded-lg border border-benson-pale bg-benson-offwhite p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-benson-maroon">
                Resources
              </p>
              <h2 className="mt-3 break-words text-3xl font-bold text-benson-charcoal">
                Practical guidance before you request work
              </h2>
              <p className="mt-3 text-benson-slate">
                Review what to send before requesting a scope, how Harney County
                routing works, and how to think about monthly South County routes
                versus one-off repair work.
              </p>
              <div className="mt-6">
                <CTAButton href="/resources">Browse Resources</CTAButton>
              </div>
            </div>
            <div className="min-w-0 rounded-lg border border-benson-pale bg-benson-cream p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-benson-maroon">
                Tools
              </p>
              <h2 className="mt-3 break-words text-3xl font-bold text-benson-charcoal">
                Use the subscription recommendation tool carefully
              </h2>
              <p className="mt-3 text-benson-slate">
                The current tool returns a public plan suggestion plus the
                assumptions used. It is educational and should not be read as a
                price, timing, or route promise.
              </p>
              <div className="mt-6">
                <CTAButton href="/tools/subscription-recommendation">
                  Open the Tool
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="rounded-3xl border border-benson-pale bg-benson-cream p-6 sm:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-benson-maroon">
                  Helpful pages
                </p>
                <h2 className="mt-3 text-3xl font-bold text-benson-charcoal">
                  Deeper pages for planning, routing, and scope prep
                </h2>
                <p className="mt-3 text-benson-slate">
                  These pages give you a clearer first pass before you send a request. Use them to check service fit, review request prep, and understand the public route model.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Link href="/services/residential-remodeling" className="rounded-2xl border border-benson-pale bg-white p-5 shadow-sm transition-colors hover:border-benson-maroon">
                <h3 className="text-xl font-semibold text-benson-charcoal">Residential Remodeling</h3>
                <p className="mt-2 text-benson-slate">
                  Review the kind of smaller residential scope that can be handled alongside other practical repair work.
                </p>
              </Link>
              <Link href="/services/church-nonprofit-maintenance" className="rounded-2xl border border-benson-pale bg-white p-5 shadow-sm transition-colors hover:border-benson-maroon">
                <h3 className="text-xl font-semibold text-benson-charcoal">Church and Non-Profit Maintenance</h3>
                <p className="mt-2 text-benson-slate">
                  See how facility upkeep is framed for congregations and community organizations.
                </p>
              </Link>
              <Link href="/resources/send-photos-address-and-scope" className="rounded-2xl border border-benson-pale bg-white p-5 shadow-sm transition-colors hover:border-benson-maroon">
                <h3 className="text-xl font-semibold text-benson-charcoal">Request Prep Checklist</h3>
                <p className="mt-2 text-benson-slate">
                  Send the right photos, measurements, and location details the first time.
                </p>
              </Link>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Link href="/resources/harney-county-routes-and-south-county-planning" className="rounded-2xl border border-benson-pale bg-white p-5 shadow-sm transition-colors hover:border-benson-maroon">
              <h3 className="text-lg font-semibold text-benson-charcoal">Harney County Route Planning</h3>
              <p className="mt-2 text-benson-slate">
                Understand the public service area and how remote requests are reviewed.
              </p>
            </Link>
            <Link href="/resources/maintenance-plans-vs-one-off-repairs" className="rounded-2xl border border-benson-pale bg-white p-5 shadow-sm transition-colors hover:border-benson-maroon">
              <h3 className="text-lg font-semibold text-benson-charcoal">Plans vs. One-Off Repairs</h3>
              <p className="mt-2 text-benson-slate">
                Compare recurring support with a single repair scope before you decide what to request.
              </p>
            </Link>
            <Link href="/window-screen-repair-harney-county-or" className="rounded-2xl border border-benson-pale bg-white p-5 shadow-sm transition-colors hover:border-benson-maroon">
              <h3 className="text-lg font-semibold text-benson-charcoal">Window Screen Repair</h3>
              <p className="mt-2 text-benson-slate">
                Review the screen-specific page when mesh, frames, or replacement options matter most.
              </p>
            </Link>
          </div>
        </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-benson-charcoal mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <FAQ items={homePageFAQs} />
        </div>
      </section>

      <section className="py-20 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-benson-cream">
            Send photos, dimensions, address or location, access notes, priority
            level, and timing constraints. We&apos;ll review the route fit and scope.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              href="/contact"
              size="lg"
              className="bg-benson-offwhite !text-benson-charcoal hover:bg-benson-cream"
            >
              Contact Us
            </CTAButton>
            <a
              href={company.phoneHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-benson-maroon-dark px-6 py-3 text-lg font-medium text-benson-offwhite transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-benson-wine hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-cream focus-visible:ring-offset-2 focus-visible:ring-offset-benson-maroon active:translate-y-px"
            >
              {company.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
