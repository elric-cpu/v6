import Link from "next/link";
import { company, harneyCountySiloSummary, sweetHomeSiloSummary } from "@/data/company";

export default function Footer() {
  return (
    <footer className="bg-benson-charcoal text-benson-offwhite">
      {/* CCB Trust Strip */}
      <div className="bg-benson-wine">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-benson-cream">
            <span>Oregon CCB #{company.ccbNumber}</span>
            <span>•</span>
            <span>{company.legalName}</span>
            <span>•</span>
            <span>Verified service-area messaging only</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">
              {company.brandName}
            </h3>
            <p className="text-benson-slate text-sm mb-4">
              Practical repair, restoration, and maintenance work for Oregon
              properties.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <a
                  href={company.phoneHref}
                  className="hover:text-benson-cream transition-colors"
                >
                  {company.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  href={company.emailHref}
                  className="hover:text-benson-cream transition-colors"
                >
                  {company.email}
                </a>
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/inspection-repairs"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Inspection Repairs
                </Link>
              </li>
              <li>
                <Link
                  href="/services/water-damage"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Water, Mold & Moisture
                </Link>
              </li>
              <li>
                <Link
                  href="/services/window-door-replacement"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Window & Door Replacements
                </Link>
              </li>
              <li>
                <Link
                  href="/services/emergency-response"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Emergency Response
                </Link>
              </li>
              <li>
                <Link
                  href="/services/energy-weatherization"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Energy & Weatherization
                </Link>
              </li>
              <li>
                <Link
                  href="/services/commercial-maintenance"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Commercial Maintenance
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-benson-offwhite">Sweet Home 25-Mile Silo</p>
                <p className="mt-1 text-benson-slate">{sweetHomeSiloSummary}</p>
              </div>
              <div>
                <p className="font-medium text-benson-offwhite">Harney County</p>
                <p className="mt-1 text-benson-slate">{harneyCountySiloSummary}</p>
              </div>
              <Link
                href="/areas"
                className="inline-block text-benson-slate transition-colors hover:text-benson-cream"
              >
                Review all service areas
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/plans"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Maintenance Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/how-we-work"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  How We Work
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/subscription-recommendation"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Subscription Tool
                </Link>
              </li>
              <li>
                <a
                  href="https://www.oregon.gov/ccb/Pages/index.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-benson-slate hover:text-benson-cream transition-colors"
                >
                  Verify CCB License
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-benson-slate mt-8 pt-8 text-center text-sm text-benson-slate">
          <p>
            &copy; {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p className="mt-2">Oregon CCB #{company.ccbNumber}</p>
        </div>
      </div>
    </footer>
  );
}
