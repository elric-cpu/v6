import ContactForm from "@/components/ContactForm";
import { company, harneyCountySiloSummary } from "@/data/company";
import { api } from "@/lib/api";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata(
  "Contact",
  "Contact Benson Home Solutions for practical repair, restoration, maintenance, and route-aware service review in Harney County.",
);

export default async function ContactPage() {
  const { services } = await api.getServices();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-benson-slate max-w-3xl">
            Send photos, dimensions, the address or location, access notes,
            priority level, and timing constraints so the work can be reviewed
            for the right Harney County route.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-benson-charcoal mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-benson-charcoal mb-2">
                    Phone
                  </h3>
                  <p className="text-benson-slate">
                    <a
                      href={company.phoneHref}
                      className="hover:text-benson-maroon transition-colors"
                    >
                      {company.phoneDisplay}
                    </a>
                  </p>
                  <p className="text-benson-slate text-sm mt-1">
                    <a
                      href={company.emergencyPhoneHref}
                      className="hover:text-benson-maroon transition-colors"
                    >
                      Emergency: {company.emergencyPhoneDisplay}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-benson-charcoal mb-2">
                    Email
                  </h3>
                  <p className="text-benson-slate">
                    <a
                      href={company.emailHref}
                      className="hover:text-benson-maroon transition-colors"
                    >
                      {company.email}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-benson-charcoal mb-2">
                    Service Areas
                  </h3>
                  <div className="space-y-3 text-benson-slate">
                    <p>{harneyCountySiloSummary}</p>
                    <p>
                      Remote South County requests are grouped into planned
                      monthly routes when timing, access, weather, and scope fit.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-benson-charcoal mb-2">
                    Licensing
                  </h3>
                  <p className="text-benson-slate">Oregon CCB #{company.ccbNumber}</p>
                  <p className="text-benson-slate text-sm">
                    License verification available through the Oregon CCB portal.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-benson-pale rounded-lg p-6">
              <h2 className="text-2xl font-bold text-benson-charcoal mb-6">
                Send Us a Message
              </h2>
              <ContactForm services={services} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
