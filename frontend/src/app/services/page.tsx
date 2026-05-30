import Link from "next/link";
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
  "/services",
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
                Practical solutions for Harney County properties. Clear scopes,
                route-aware scheduling, monthly South County planning, and clean
                documentation.
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
                      width={service.image.width ?? 1200}
                      height={service.image.height ?? 1600}
                      sizes={index === 0 ? "(min-width: 1024px) 380px, 100vw" : "(min-width: 1024px) 120px, 50vw"}
                      priority={index === 0}
                      quality={65}
                      className="h-full w-full object-cover"
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
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-bold text-benson-charcoal mb-3">
              Service Categories
            </h2>
            <p className="text-benson-slate">
              The public service list stays focused on the categories that match actual Harney County work. Use it to match the right scope before you send a request.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8">
            Related Service Pages and Reading
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <Link href="/services/residential-remodeling" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Residential Remodeling</h3>
              <p className="mt-3 text-benson-slate">
                See how smaller remodel and repair scopes are handled in the public service lineup.
              </p>
            </Link>
            <Link href="/services/church-nonprofit-maintenance" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Church and Non-Profit Maintenance</h3>
              <p className="mt-3 text-benson-slate">
                Review the facility-support page for congregations and community spaces.
              </p>
            </Link>
            <Link href="/resources/send-photos-address-and-scope" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Request Prep Checklist</h3>
              <p className="mt-3 text-benson-slate">
                Gather photos, measurements, and access details before you submit a request.
              </p>
            </Link>
            <Link href="/resources/maintenance-plans-vs-one-off-repairs" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Plans vs. One-Off Repairs</h3>
              <p className="mt-3 text-benson-slate">
                Compare recurring support with a single repair scope before deciding what to book.
              </p>
            </Link>
            <Link href="/window-screen-repair-harney-county-or" className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm hover:border-benson-maroon transition-colors">
              <h3 className="text-xl font-semibold text-benson-charcoal">Window Screen Repair</h3>
              <p className="mt-3 text-benson-slate">
                Review a focused screen-repair page for the window and door replacement category.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help Choosing?</h2>
          <p className="text-xl mb-8 text-benson-cream">
            Send photos, dimensions, address or location, access notes, priority
            level, and timing constraints. We&apos;ll review the practical next step.
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
