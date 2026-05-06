import Link from "next/link";
import { api } from "@/lib/api";
import CTAButton from "@/components/CTAButton";
import { company, harneyCountySiloSummary, sweetHomeSiloSummary } from "@/data/company";
import { groupAreasBySilo } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata(
  "Service Areas",
  "Review the two Benson Home Solutions service-area silos: the Sweet Home 25-mile coverage area and the route-dependent Harney County footprint.",
);

export default async function AreasPage() {
  const { areas } = await api.getServiceAreas();
  const { sweetHome, harneyCounty } = groupAreasBySilo(areas);

  return (
    <>
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            Service Areas
          </h1>
          <p className="text-xl text-benson-slate max-w-3xl">
            Two service-area silos are currently active: the Sweet Home 25-mile footprint and Harney County routing.
          </p>
        </div>
      </section>

      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-2">
            Sweet Home 25-Mile Area
          </h2>
          <p className="text-benson-slate mb-8">
            {sweetHomeSiloSummary}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {sweetHome.map((area) => (
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
          <div className="bg-benson-cream border border-benson-pale rounded-lg p-6">
            <h3 className="font-semibold text-benson-charcoal mb-4">
              Local Risks in This Area
            </h3>
            <ul className="list-disc list-inside text-benson-slate space-y-2">
              {sweetHome[0]?.localizedRisks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-2">
            Harney County
          </h2>
          <p className="text-benson-slate mb-8">
            {harneyCountySiloSummary}
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
              Local Risks in This Area
            </h3>
            <ul className="list-disc list-inside text-benson-slate space-y-2">
              {harneyCounty[0]?.localizedRisks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Don&apos;t see your area?</h2>
          <p className="text-xl mb-8 text-benson-cream">
            Contact us to discuss the address, photos, and access details. We’ll let you know whether the scope fits our current route and schedule.
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
