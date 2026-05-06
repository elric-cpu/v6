import Image from "next/image";
import ServiceCard from "@/components/ServiceCard";
import CTAButton from "@/components/CTAButton";
import { buildPageMetadata } from "@/lib/metadata";
import { api } from "@/lib/api";
import { company } from "@/data/company";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata(
  "Services",
  "Review the current Benson Home Solutions service categories, including inspection repairs, moisture response, window and door replacement, maintenance, preservation, remodeling, and facility support.",
);

export default async function ServicesPage() {
  const { services } = await api.getServices();

  const featuredImages = services
    .filter((service) => service.image)
    .slice(0, 3)
    .map((service) => ({
      id: service.id,
      title: service.title,
      image: service.image!,
    }));

  return (
    <>
      {/* Hero Section */}
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
                Our Services
              </h1>
              <p className="text-xl text-benson-slate max-w-3xl">
                Practical solutions for Oregon properties. Clear scopes, clean
                documentation, completed work.
              </p>
            </div>
            {featuredImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {featuredImages.map((service, index) => (
                  <div
                    key={service.id}
                    className={`relative overflow-hidden rounded-2xl border border-benson-pale bg-white ${
                      index === 0 ? "col-span-3 aspect-[16/9]" : "aspect-[4/5]"
                    }`}
                  >
                    <Image
                      src={service.image.src}
                      alt={service.image.alt}
                      fill
                      sizes={index === 0 ? "(min-width: 1024px) 380px, 100vw" : "(min-width: 1024px) 120px, 50vw"}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help Choosing?</h2>
          <p className="text-xl mb-8 text-benson-cream">
            Send the photos, the address, and what needs attention. We&apos;ll review the practical next step.
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
