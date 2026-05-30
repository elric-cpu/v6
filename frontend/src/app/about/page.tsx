import Link from "next/link";
import { company, harneyCountySiloSummary } from "@/data/company";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(
  "About Harney County",
  "Learn how Benson Home Solutions serves Harney County with route-aware repair, restoration, maintenance, and documented public service-area messaging.",
  "/about",
);

export default function AboutPage() {
  return (
    <>
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            About Benson Home Solutions
          </h1>
          <p className="text-xl text-benson-slate">
            Benson Home Solutions is the public-facing repair and maintenance
            brand for Benson Enterprises, LLC. The site is intentionally focused
            on practical Harney County routing, clear scope review, and
            documented communication so property owners can decide the next step
            with fewer guesses.
          </p>
        </div>
      </section>

      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-benson-slate">
          <article className="rounded-3xl border border-benson-pale bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-benson-charcoal mb-4">
              What the business is set up to do
            </h2>
            <p>
              The website exists to help route service requests into practical
              buckets: inspection repairs, moisture response, windows and doors,
              maintenance plans, emergency response, property preservation,
              remodeling, and commercial or church facility care. Each page is
              built to describe the actual intake information that makes review
              more accurate.
            </p>
            <p className="mt-4">
              That means the site emphasizes photos, measurements, access notes,
              timing constraints, and address or location details rather than
              generic sales copy. It also avoids making promises about
              same-day response, pricing, or final scope until the request has
              been reviewed against route and logistics.
            </p>
          </article>

          <article className="rounded-3xl border border-benson-pale bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-benson-charcoal mb-4">
              Public service geography
            </h2>
            <p>
              {harneyCountySiloSummary}
            </p>
            <p className="mt-4">
              Remote communities are handled through route-dependent scheduling,
              not by assuming unlimited coverage. That keeps the public message
              honest and makes it easier for visitors to understand when a
              request fits a current route and when it needs to wait for a
              planned monthly run.
            </p>
          </article>

          <article className="rounded-3xl border border-benson-pale bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-benson-charcoal mb-4">
              Business identity
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Brand: {company.brandName}</li>
              <li>Legal name: {company.legalName}</li>
              <li>Oregon CCB #{company.ccbNumber}</li>
              <li>Primary contact: {company.phoneDisplay}</li>
              <li>Email: {company.email}</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-benson-pale bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-benson-charcoal mb-4">
              Next step
            </h2>
            <p>
              If you are comparing services, review the{" "}
              <Link href="/services" className="text-benson-maroon hover:text-benson-maroon-dark">
                service pages
              </Link>
              . If you want to know whether the work fits the public route model,
              check the{" "}
              <Link href="/areas" className="text-benson-maroon hover:text-benson-maroon-dark">
                service areas
              </Link>
              . When you are ready to send photos and scope details, use the{" "}
              <Link href="/contact" className="text-benson-maroon hover:text-benson-maroon-dark">
                contact page
              </Link>
              .
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
