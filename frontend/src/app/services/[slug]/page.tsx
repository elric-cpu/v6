import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import FAQ from "@/components/FAQ";
import { company } from "@/data/company";
import { getServiceContentBySlug } from "@/data/servicePageContent";
import { api } from "@/lib/api";
import { getServiceBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: ServiceDetailPageProps): Metadata {
  const content = getServiceContentBySlug(params.slug);

  if (!content) {
    return {
      title: "Service Not Found",
      description: "Requested service page was not found.",
    };
  }

  return {
    title: content.title,
    description: content.description,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const content = getServiceContentBySlug(params.slug);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-benson-cream px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-benson-charcoal mb-4">
            Service page not found
          </h1>
          <p className="text-benson-slate">
            This service route is not available right now.
          </p>
        </div>
      </div>
    );
  }

  return renderServicePage(content, params.slug);
}

async function renderServicePage(content: NonNullable<ReturnType<typeof getServiceContentBySlug>>, slug: string) {
  const { services } = await api.getServices();
  const service = getServiceBySlug(services, slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-benson-cream px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-benson-charcoal mb-4">
            Service page not available
          </h1>
          <p className="text-benson-slate">
            The service route exists in content, but the current public API does not expose a matching service card yet.
          </p>
        </div>
      </div>
    );
  }

  const processSteps = [
    {
      title: "Send photos and context",
      description:
        "Start with photos, the address, and any notes that explain the condition, timing, or access limits.",
    },
    {
      title: "Review and scope",
      description:
        "The first pass separates urgent conditions from scheduled work and defines the practical next step.",
    },
    {
      title: "Schedule and complete",
      description:
        "Work is scheduled around scope, site conditions, route realities, and access constraints.",
    },
    {
      title: "Document the result",
      description:
        "Completion photos and invoicing keep the record clear for owners, managers, and follow-up reviewers.",
    },
  ];

  return (
    <>
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-benson-slate mb-4">
            <Link href="/services" className="hover:text-benson-maroon">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-benson-charcoal">{content.title}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
                {content.title}
              </h1>
              <p className="text-xl text-benson-slate max-w-3xl mb-5">
                {content.description}
              </p>
              <p className="text-benson-slate max-w-3xl mb-8">{content.heroSummary}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <CTAButton href="/contact" size="lg">
                  {service.ctaLabel}
                </CTAButton>
                <a
                  href={company.phoneHref}
                  className="inline-block rounded bg-benson-charcoal px-6 py-3 text-center text-lg font-medium text-benson-offwhite transition-colors hover:bg-benson-slate"
                >
                  {company.phoneDisplay}
                </a>
              </div>
            </div>
            {service.image ? (
              <div className="overflow-hidden rounded-3xl border border-benson-pale bg-white shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="border-t border-benson-pale px-5 py-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-benson-maroon">
                    Real Project Photo
                  </p>
                  <p className="mt-1 text-sm text-benson-slate">
                    {service.image.caption ?? "Documented field image from Benson project work."}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold text-benson-charcoal mb-6">
                What you&apos;re dealing with
              </h2>
              <div className="space-y-4 text-benson-slate">
                {content.situation.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="bg-benson-cream border border-benson-pale rounded-2xl p-6">
              <h3 className="font-semibold text-benson-charcoal mb-4">What to send next</h3>
              <ul className="list-disc list-inside text-benson-slate space-y-2">
                {content.whatToSend.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8">Scope highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.scopeSections.map((section) => (
              <div key={section.title} className="bg-white border border-benson-pale rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-benson-charcoal mb-4">{section.title}</h3>
                <ul className="list-disc list-inside text-benson-slate space-y-2">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8">How we work</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-benson-charcoal mb-2">{step.title}</h3>
                <p className="text-benson-slate text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-benson-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8 text-center">
            Frequently asked questions
          </h2>
          <FAQ items={content.faqs} />
        </div>
      </section>

      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{content.finalCtaTitle}</h2>
          <p className="text-xl mb-8 text-benson-cream">{content.finalCtaText}</p>
          <CTAButton
            href="/contact"
            size="lg"
            className="bg-white text-benson-charcoal hover:bg-benson-cream"
          >
            Contact Us
          </CTAButton>
        </div>
      </section>
    </>
  );
}
