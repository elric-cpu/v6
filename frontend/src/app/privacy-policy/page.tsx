import Link from "next/link";
import { company } from "@/data/company";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(
  "Privacy Policy",
  "Read how Benson Home Solutions handles contact submissions, route-review details, analytics, image metadata, and public site data. The policy explains what is collected, how it is used, how long it is retained, and where to send questions about the website.",
  "/privacy-policy",
);

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-benson-cream py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-benson-charcoal mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-benson-slate">
            This page explains how Benson Home Solutions handles information
            submitted through the website, including the contact form, route
            review details, text follow-up, and standard analytics.
          </p>
        </div>
      </section>

      <section className="py-16 bg-benson-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-benson-slate">
          <article className="rounded-3xl border border-benson-pale bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-benson-charcoal mb-4">
              What we collect
            </h2>
            <p>
              When you send a message through the contact form, we may collect
              your name, phone number, email address, property location details,
              service type, message content, and route context such as timing or
              access notes. Your phone number may also be used for call or text
              follow-up about the request.
            </p>
            <p className="mt-4">
              The website also uses standard analytics tools to understand page
              performance and general traffic patterns. These tools may collect
              device, browser, and page-usage information.
            </p>
          </article>

          <article className="rounded-3xl border border-benson-pale bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-benson-charcoal mb-4">
              How we use it
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To review and respond to service requests.</li>
              <li>To route requests by service area and timing.</li>
              <li>To follow up by phone, text, or email when needed.</li>
              <li>To document public-facing service information and site health.</li>
              <li>To reduce spam and abuse on the contact form.</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-benson-pale bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-benson-charcoal mb-4">
              Retention and sharing
            </h2>
            <p>
              Contact submissions may be retained for business follow-up,
              scheduling, and recordkeeping. We do not sell personal data.
              Information may be shared with service providers only when needed
              to operate the website or respond to your request.
            </p>
          </article>

          <article className="rounded-3xl border border-benson-pale bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-benson-charcoal mb-4">
              Security and third-party tools
            </h2>
            <p>
              The site uses spam protection, analytics, and hosted infrastructure
              to keep the public website working. These services may process
              limited technical data needed to provide their function.
            </p>
          </article>

          <article className="rounded-3xl border border-benson-pale bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-benson-charcoal mb-4">
              Contact
            </h2>
            <p>
              Questions about this policy or about the information you submit
              through the website can be sent to{" "}
              <a
                href={company.emailHref}
                className="text-benson-maroon hover:text-benson-maroon-dark"
              >
                {company.email}
              </a>
              .
            </p>
            <p className="mt-4">
              You can also return to the{" "}
              <Link href="/contact" className="text-benson-maroon hover:text-benson-maroon-dark">
                contact page
              </Link>{" "}
              if you want to send a request directly.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
