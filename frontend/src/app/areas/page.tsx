import Link from "next/link";
import { api } from "@/lib/api";
import CTAButton from "@/components/CTAButton";
import { company, harneyCountySiloSummary } from "@/data/company";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata(
  "Service Areas",
  "Review Benson Home Solutions Harney County routing, including Burns, Hines, Crane, Drewsey, Frenchglen, Fields, Diamond, Princeton, Riley, Lawen, and planned monthly South County routes.",
  "/areas",
);

export default async function AreasPage() {
  const { areas } = await api.getServiceAreas();
  const harneyCounty = areas.filter((area) => area.silo === "harney-county");

  return (
    <>
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            Service Areas
          </h1>
          <p className="text-xl text-benson-slate max-w-3xl">
            Harney County is the public service geography. Requests are reviewed
            around location, access, priority, timing, and monthly South County
            route fit.
          </p>
        </div>
      </section>

      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-2">
            Harney County Routing
          </h2>
          <p className="text-benson-slate mb-8">
            {harneyCountySiloSummary} Send photos, dimensions, the address or
            location, access notes, priority level, and timing constraints before
            assuming a route or site visit.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {harneyCounty.map((area) => (
              <Link
                key={area.id}
                href={`/areas/${area.id}`}
                className="bg-white border border-benson-pale rounded-lg p-4 text-center hover:border-benson-maroon transition-colors"
              >
                <span className="text-benson-charcoal font-medium">{area.city}</span>
                <span className="block text-xs text-benson-maroon mt-1 capitalize">
                  {area.priority}
                </span>
              </Link>
            ))}
          </div>
          <div className="bg-white border border-benson-pale rounded-lg p-6">
            <h3 className="font-semibold text-benson-charcoal mb-4">
              Route Planning Notes
            </h3>
            <ul className="list-disc list-inside text-benson-slate space-y-2">
              {harneyCounty[0]?.localizedRisks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
              <li>Monthly South County routes are planned by grouped scope, weather, access, materials, and timing constraints.</li>
            </ul>
            <p className="mt-4 text-benson-slate">
              If your location is remote or route-dependent, send the exact
              address or location, photos, and a short note about whether the
              issue is active now. That gives the intake review enough context
              to decide whether it belongs on a current route or a future
              monthly trip.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Link href="/services" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Match the service first</h3>
              <p className="mt-3 text-benson-slate">
                Review the service categories before you request a route review so the intake starts with the right scope.
              </p>
            </Link>
            <Link href="/contact" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Send route details</h3>
              <p className="mt-3 text-benson-slate">
                Photos, dimensions, location, access notes, priority level, and timing constraints make the route review clearer.
              </p>
            </Link>
            <Link href="/privacy-policy" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Review site policies</h3>
              <p className="mt-3 text-benson-slate">
                Learn how contact submissions and site data are handled before you send a request.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Remote South County request?</h2>
          <p className="text-xl mb-8 text-benson-cream">
            Send the address or location, photos, dimensions, access details,
            priority level, and timing limits. We’ll review whether the scope
            fits a current or upcoming monthly route.
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
