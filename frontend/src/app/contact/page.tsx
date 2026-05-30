import ContactForm from "@/components/ContactForm";
import { company, harneyCountySiloSummary } from "@/data/company";
import { api } from "@/lib/api";
import { buildPageMetadata } from "@/lib/metadata";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata(
  "Contact",
  "Contact Benson Home Solutions for practical repair, restoration, maintenance, and route-aware service review in Harney County. Send photos, dimensions, access notes, and timing details so the request can be reviewed against route fit, priority, and the practical next step.",
  "/contact",
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
                <div>
                  <h3 className="font-semibold text-benson-charcoal mb-2">
                    Privacy
                  </h3>
                  <p className="text-benson-slate">
                    Contact submissions are handled with route review, follow-up,
                    and basic site protection. See the{" "}
                    <Link href="/privacy-policy" className="hover:text-benson-maroon">
                      privacy policy
                    </Link>{" "}
                    for details.
                  </p>
                  <p className="mt-4 text-benson-slate">
                    For remote South County requests, it also helps to mention
                    whether the work can wait for a planned monthly route or
                    whether the condition is urgent enough to need a separate
                    review. That makes it easier to line up the request with the
                    actual travel, weather, and materials reality of the area.
                  </p>
                  <p className="mt-4 text-benson-slate">
                    Photos, a short summary of the problem, and a clear priority
                    level are usually enough to start the review. If there is a
                    report, invoice, or note from another contractor, feel free
                    to mention that as well so the scope can be understood in
                    one pass. We may also follow up by phone or text if that is
                    the fastest way to review the request.
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

      <section className="py-16 bg-benson-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-bold text-benson-charcoal mb-3">
              What helps the first reply move faster
            </h2>
            <p className="text-benson-slate">
              The best requests are concrete: they show the issue, the location, and the practical constraints in one pass. That makes it easier to sort the work, decide whether it belongs on a current trip, and avoid unnecessary back-and-forth.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-benson-charcoal">Photos and measurements</h3>
              <p className="mt-3 text-benson-slate">
                Clear photos and rough dimensions help with screening, openings, trim, and repair scope.
              </p>
            </div>
            <div className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-benson-charcoal">Access and timing</h3>
              <p className="mt-3 text-benson-slate">
                Road conditions, gate details, occupant limits, weather, and deadlines all affect whether the job can be routed soon or planned later.
              </p>
            </div>
            <div className="rounded-2xl border border-benson-pale bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-benson-charcoal">A short summary</h3>
              <p className="mt-3 text-benson-slate">
                A few plain sentences about what is happening now usually give enough context for a useful first review.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
