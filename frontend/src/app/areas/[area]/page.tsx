import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import CTAButton from "@/components/CTAButton";
import { company } from "@/data/company";
import { getAreaById } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";

interface AreaPageProps {
  params: {
    area: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: AreaPageProps) {
  const { areas } = await api.getServiceAreas();
  const area = getAreaById(areas, params.area);

  return buildPageMetadata(
    area ? `${area.city} Service Area` : "Service Area",
    "Local service-area details for Benson Home Solutions coverage and route-dependent scheduling.",
  );
}

export default async function AreaPage({ params }: AreaPageProps) {
  const [areaData, serviceData] = await Promise.all([
    api.getServiceAreas(),
    api.getServices(),
  ]);
  const area = getAreaById(areaData.areas, params.area);

  if (!area) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-benson-cream px-4">
        <div className="max-w-xl text-center">
          <p className="text-benson-maroon text-lg">Service area not found.</p>
        </div>
      </div>
    );
  }

  const services = serviceData.services;
  const featuredAreaImage =
    services.find((service) => service.serviceType === area.services[0]?.serviceType)?.image
      ?? services.find((service) => service.image)?.image
      ?? null;

  return (
    <>
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-benson-slate mb-4">
            <Link href="/areas" className="hover:text-benson-maroon">
              Service Areas
            </Link>
            <span className="mx-2">/</span>
            <span className="text-benson-charcoal">{area.city}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            {area.city}, Oregon
          </h1>
          <p className="text-xl text-benson-slate max-w-3xl">
            Practical repair, restoration, and maintenance work for {area.city} properties, routed according to the current service-area model.
          </p>
        </div>
      </section>

      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-benson-charcoal mb-6">
                About {area.city}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-benson-charcoal mb-2">ZIP Codes</h3>
                  <p className="text-benson-slate">
                    {area.zipCodes.length > 0 ? area.zipCodes.join(", ") : "VERIFY BEFORE PUBLISHING"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-benson-charcoal mb-2">Region</h3>
                  <p className="text-benson-slate">{area.regionLabel}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-benson-charcoal mb-2">Service Priority</h3>
                  <p className="text-benson-slate capitalize">{area.priority}</p>
                </div>
                {area.silo === "harney-county" ? (
                  <div>
                    <h3 className="font-semibold text-benson-charcoal mb-2">Harney County note</h3>
                    <p className="text-benson-slate">
                      Remote Harney County work is planned and logistics-dependent unless emergency-response availability is explicitly confirmed.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-benson-charcoal mb-6">
                Local Risks
              </h2>
              {featuredAreaImage ? (
                <div className="overflow-hidden rounded-lg border border-benson-pale bg-white mb-6">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={featuredAreaImage.src}
                      alt={featuredAreaImage.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="border-t border-benson-pale px-4 py-3">
                    <p className="text-sm text-benson-slate">{featuredAreaImage.caption}</p>
                  </div>
                </div>
              ) : null}
              <ul className="list-disc list-inside text-benson-slate space-y-2">
                {area.localizedRisks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-benson-charcoal mb-6">
            Services Available in {area.city}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {area.services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="bg-white border border-benson-pale rounded-lg p-4 hover:border-benson-maroon transition-colors"
              >
                <span className="text-benson-charcoal font-medium">{service.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Need service in {area.city}?
          </h2>
          <p className="text-xl mb-8 text-benson-cream">
            Send the photos, the address, and what needs attention. We’ll review the scope and next step.
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
