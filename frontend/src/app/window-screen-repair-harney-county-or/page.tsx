import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import FAQ from "@/components/FAQ";
import { company } from "@/data/company";
import { buildPageMetadata } from "@/lib/metadata";
import { siteImages } from "@/data/siteImages";

export const metadata = buildPageMetadata(
  "Window Screen Repair & Replacement In Harney County, OR",
  "A focused Harney County landing page for screen repair and replacement requests within the broader window and door replacement service category.",
);

const screenRepairFAQs = [
  {
    question: "What types of window screens do you repair?",
    answer:
      "We repair torn or loose mesh, bent frames, loose corners, and worn-out window screens. We can rebuild existing screens with new mesh and spline, or provide full replacement when the frame is beyond repair.",
  },
  {
    question: "Do you offer custom-fit screens?",
    answer:
      "Yes. We can build custom screens to fit your windows. Send screen dimensions or photos for a faster quote. We work with standard, pet-resistant, and sun-control mesh options.",
  },
  {
    question: "What areas in Harney County do you serve?",
    answer:
      "We serve Burns, Hines, Crane, Riley, Drewsey, Frenchglen, Fields, Diamond, Princeton, Lawen, and nearby Harney County communities. Service to remote areas is route-dependent—contact us to confirm availability.",
  },
  {
    question: "How do I get a quote?",
    answer:
      `Call ${company.phoneDisplay} or use the contact form. For faster review, send screen dimensions or photos of damaged screens and include the property address.`,
  },
  {
    question: "Do you repair screen doors?",
    answer:
      "Yes, we repair sliding screen doors, patio screens, and screen door frames. Contact us with details about your screen door for a quote.",
  },
  {
    question: "What mesh options are available?",
    answer:
      "We offer standard fiberglass mesh, pet-resistant mesh for homes with pets, and sun-control mesh that reduces heat and UV. We&apos;ll help you choose the right option for your needs.",
  },
];

export default function WindowScreenRepairHarneyCountyPage() {
  const screenImage = siteImages.windowDoorReplacements;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-benson-slate mb-4">
            <Link href="/services" className="hover:text-benson-maroon">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-benson-charcoal">Window Screen Repair</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            Window Screen Repair & Replacement in Harney County, OR
          </h1>
          <p className="text-xl text-benson-slate max-w-3xl mb-8">
            Local window screen repair, rebuilding, and replacement for homes
            across Harney County. We repair torn mesh, rebuild old screens,
            replace damaged frames, and provide custom-fit screen options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <CTAButton href="/contact" size="lg">
              Request Screen Repair Review
            </CTAButton>
            <a
              href={company.phoneHref}
              className="inline-block bg-benson-charcoal text-benson-offwhite px-6 py-3 rounded hover:bg-benson-slate transition-colors text-lg font-medium"
            >
              Call For Screen Repair
            </a>
          </div>
          <div className="flex items-center gap-2 text-benson-slate">
            <span className="font-medium">Oregon CCB #{company.ccbNumber}</span>
            <span className="text-benson-pale">|</span>
            <span>{company.legalName}</span>
          </div>
        </div>
      </section>

      {/* Situation Section */}
      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8">
            What You&apos;re Dealing With
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-benson-slate mb-6">
                Torn, bent, or missing window screens let bugs, dust, and debris
                inside. Old screens with loose mesh or damaged frames don&apos;t seal
                properly, reducing comfort and protection.
              </p>
              <p className="text-benson-slate">
                We repair torn mesh, rebuild existing screens with new spline,
                replace damaged frames, and build custom-fit screens for your
                windows. Send screen sizes or photos for a faster quote.
              </p>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-benson-pale bg-white">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={screenImage.src}
                    alt={screenImage.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="border-t border-benson-pale px-4 py-3">
                  <p className="text-sm text-benson-slate">{screenImage.caption}</p>
                </div>
              </div>
              <div className="bg-benson-cream border border-benson-pale rounded-lg p-6">
                <h3 className="font-semibold text-benson-charcoal mb-4">
                  What to Send Next
                </h3>
                <ul className="list-disc list-inside text-benson-slate space-y-2">
                  <li>Screen dimensions (width × height)</li>
                  <li>Photos of damaged screens</li>
                  <li>Property address</li>
                  <li>Number of screens needing repair</li>
                  <li>Any notes about access, timeline, or replacement preference</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scope Cards */}
      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8">
            Screen Services We Provide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Window Screen Repair
              </h3>
              <ul className="list-disc list-inside text-benson-slate space-y-2">
                <li>Torn mesh replacement</li>
                <li>Loose spline repair</li>
                <li>Corner fixes</li>
                <li>Frame straightening</li>
              </ul>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Screen Rebuilding
              </h3>
              <ul className="list-disc list-inside text-benson-slate space-y-2">
                <li>Rescreen existing frames</li>
                <li>New mesh installation</li>
                <li>Spline replacement</li>
                <li>Frame restoration</li>
              </ul>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Full Screen Replacement
              </h3>
              <ul className="list-disc list-inside text-benson-slate space-y-2">
                <li>Custom-fit new screens</li>
                <li>Frame replacement</li>
                <li>Multiple screen packages</li>
                <li>Matching existing styles</li>
              </ul>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Pet-Resistant Screens
              </h3>
              <ul className="list-disc list-inside text-benson-slate space-y-2">
                <li>Discuss alternative screen materials</li>
                <li>Review whether replacement is more practical</li>
                <li>Compare repair versus rebuild</li>
                <li>Confirm fit before ordering</li>
              </ul>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Sun-Control Screens
              </h3>
              <ul className="list-disc list-inside text-benson-slate space-y-2">
                <li>Discuss alternate material options before ordering</li>
                <li>Review whether a standard replacement fits better</li>
                <li>Coordinate with the window opening condition</li>
                <li>Confirm the scope based on the actual screen need</li>
              </ul>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h3 className="text-xl font-semibold text-benson-charcoal mb-4">
                Screen Door Repair
              </h3>
              <ul className="list-disc list-inside text-benson-slate space-y-2">
                <li>Sliding screen doors</li>
                <li>Patio screen replacement</li>
                <li>Roller and track repair</li>
                <li>Frame fixes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Send Details
              </h3>
              <p className="text-benson-slate text-sm">
                Call or send screen dimensions and photos. We&apos;ll review and provide
                feedback.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Get A Quote
              </h3>
              <p className="text-benson-slate text-sm">
                We&apos;ll provide a clear estimate for repair, rebuilding, or
                replacement.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Schedule Service
              </h3>
              <p className="text-benson-slate text-sm">
                We&apos;ll schedule a convenient time for on-site measurement or
                service.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-benson-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-benson-charcoal mb-2">
                Complete Work
              </h3>
              <p className="text-benson-slate text-sm">
                We&apos;ll repair or replace your screens and ensure proper fit and
                function.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8">
            Harney County Service Area
          </h2>
          <p className="text-benson-slate mb-8 max-w-3xl">
            Serving Burns, Hines, Crane, Riley, Drewsey, Frenchglen, Fields,
            Diamond, Princeton, Lawen, and nearby Harney County communities.
            Service to remote areas is route-dependent—contact us to confirm
            availability for your location.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-benson-pale rounded-lg p-4 text-center">
              <h3 className="font-semibold text-benson-charcoal">Burns</h3>
              <p className="text-sm text-benson-slate">Primary Service</p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-4 text-center">
              <h3 className="font-semibold text-benson-charcoal">Hines</h3>
              <p className="text-sm text-benson-slate">Primary Service</p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-4 text-center">
              <h3 className="font-semibold text-benson-charcoal">Crane</h3>
              <p className="text-sm text-benson-slate">Route-Dependent</p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-4 text-center">
              <h3 className="font-semibold text-benson-charcoal">Riley</h3>
              <p className="text-sm text-benson-slate">Route-Dependent</p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-4 text-center">
              <h3 className="font-semibold text-benson-charcoal">Drewsey</h3>
              <p className="text-sm text-benson-slate">Route-Dependent</p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-4 text-center">
              <h3 className="font-semibold text-benson-charcoal">Frenchglen</h3>
              <p className="text-sm text-benson-slate">Route-Dependent</p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-4 text-center">
              <h3 className="font-semibold text-benson-charcoal">Fields</h3>
              <p className="text-sm text-benson-slate">Route-Dependent</p>
            </div>
            <div className="bg-white border border-benson-pale rounded-lg p-4 text-center">
              <h3 className="font-semibold text-benson-charcoal">Diamond</h3>
              <p className="text-sm text-benson-slate">Route-Dependent</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-benson-charcoal mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <FAQ items={screenRepairFAQs} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-benson-maroon text-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Fix Your Window Screens?
          </h2>
          <p className="text-xl mb-8 text-benson-cream">
            Send screen dimensions or photos. We&apos;ll provide a clear estimate for
            repair, rebuilding, or replacement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              href="/contact"
              size="lg"
              className="bg-white text-benson-charcoal hover:bg-benson-cream"
            >
              Request Screen Repair Review
            </CTAButton>
            <a
              href={company.phoneHref}
              className="inline-block bg-benson-charcoal text-benson-offwhite border-2 border-white px-6 py-3 rounded hover:bg-benson-maroon-dark transition-colors text-lg font-medium"
            >
              {company.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
