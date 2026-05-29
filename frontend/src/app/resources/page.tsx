import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import { company } from "@/data/company";
import { resources } from "@/data/resources";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(
  "Resources",
  "Browse practical Benson Home Solutions resources covering service-area routing, request preparation, and maintenance-plan decision support.",
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
                  Read the resource →
                </Link>
              </div>
            </article>
          ))}
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
