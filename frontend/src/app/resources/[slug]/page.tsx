import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import { company } from "@/data/company";
import { resourceBySlug, resources } from "@/data/resources";
import { buildPageMetadata } from "@/lib/metadata";

interface ResourceDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: ResourceDetailPageProps) {
  const resource = resourceBySlug[params.slug];

  if (!resource) {
    return buildPageMetadata("Resource Not Found", "The requested resource page is not available.");
  }

  return buildPageMetadata(resource.title, resource.description);
}

export function generateStaticParams() {
  return resources.map((resource) => ({
    slug: resource.slug,
  }));
}

export default function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const resource = resourceBySlug[params.slug];

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-benson-cream px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-benson-charcoal mb-4">Resource not found</h1>
          <p className="text-benson-slate">The requested resource page is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-benson-slate mb-4">
            <Link href="/resources" className="hover:text-benson-maroon">
              Resources
            </Link>
            <span className="mx-2">/</span>
            <span className="text-benson-charcoal">{resource.title}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            {resource.title}
          </h1>
          <p className="text-xl text-benson-slate max-w-3xl">{resource.intro}</p>
        </div>
      </section>

      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {resource.sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-benson-pale bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-benson-charcoal">{section.title}</h2>
              <div className="mt-4 space-y-4 text-benson-slate">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-5 list-disc list-inside space-y-2 text-benson-slate">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{resource.ctaTitle}</h2>
          <p className="text-xl mb-8 text-benson-cream">{resource.ctaText}</p>
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
