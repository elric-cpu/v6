import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import { company } from "@/data/company";
import { resources } from "@/data/resources";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(
  "Resources",
  "Browse practical Benson Home Solutions resources covering service-area routing, request preparation, and maintenance-plan decision support.",
  "/resources",
);

export default function ResourcesPage() {
  return (
    <>
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            Resources
          </h1>
          <p className="text-xl text-benson-slate max-w-3xl">
            Practical guidance for preparing a scope request, understanding service-area routing, and comparing scheduled maintenance with one-off repair work.
          </p>
        </div>
      </section>

      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <article key={resource.slug} className="rounded-3xl border border-benson-pale bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-benson-maroon">
                Resource
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-benson-charcoal">
                {resource.title}
              </h2>
              <p className="mt-3 text-benson-slate">{resource.description}</p>
              <div className="mt-6">
                <Link
                  href={`/resources/${resource.slug}`}
                  className="text-benson-maroon transition-colors hover:text-benson-maroon-dark"
                >
                  Read {resource.title.toLowerCase()} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 bg-benson-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-6">
            Use these resources with the rest of the site
          </h2>
          <p className="mb-6 text-benson-slate">
            The resource list works best when it is used as a pre-contact
            checklist. Read the article that matches your situation, then send
            the practical details the intake form needs so the request can be
            reviewed against Harney County routing and support timing.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <Link href="/areas" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Review service areas</h3>
              <p className="mt-3 text-benson-slate">
                Confirm whether the request fits Harney County routing and monthly South County scheduling.
              </p>
            </Link>
            <Link href="/tools/subscription-recommendation" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Compare plan fit</h3>
              <p className="mt-3 text-benson-slate">
                Use the planning tool to compare property age, size, and support level before you request service.
              </p>
            </Link>
            <Link href="/contact" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Send the request</h3>
              <p className="mt-3 text-benson-slate">
                Send photos, dimensions, location details, access notes, priority level, and timing constraints.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need the practical next step?</h2>
          <p className="text-xl mb-8 text-benson-cream">
            Use the resources to prepare the request, then send photos,
            dimensions, address or location, access notes, priority level, and
            timing constraints.
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
