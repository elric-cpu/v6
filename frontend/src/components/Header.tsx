import Link from "next/link";
import { company } from "@/data/company";

export default function Header() {
  return (
    <header className="bg-benson-charcoal text-benson-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-benson-maroon rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-benson-offwhite">
                {company.brandName}
              </h1>
              <p className="text-xs text-benson-slate">Oregon CCB #{company.ccbNumber}</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/services"
              className="text-benson-offwhite hover:text-benson-cream transition-colors"
            >
              Services
            </Link>
            <Link
              href="/plans"
              className="text-benson-offwhite hover:text-benson-cream transition-colors"
            >
              Maintenance Plans
            </Link>
            <Link
              href="/areas"
              className="text-benson-offwhite hover:text-benson-cream transition-colors"
            >
              Service Areas
            </Link>
            <Link
              href="/how-we-work"
              className="text-benson-offwhite hover:text-benson-cream transition-colors"
            >
              How We Work
            </Link>
            <Link
              href="/contact"
              className="text-benson-offwhite hover:text-benson-cream transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/resources"
              className="text-benson-offwhite hover:text-benson-cream transition-colors"
            >
              Resources
            </Link>
            <Link
              href="/tools/subscription-recommendation"
              className="text-benson-offwhite hover:text-benson-cream transition-colors"
            >
              Tools
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={company.phoneHref}
              className="text-benson-offwhite hover:text-benson-cream transition-colors"
            >
              {company.phoneDisplay}
            </a>
            <Link
              href="/contact"
              className="bg-benson-maroon hover:bg-benson-maroon-dark text-white px-4 py-2 rounded transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-benson-offwhite">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* CCB Trust Strip */}
      <div className="bg-benson-wine">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center space-x-6 text-sm text-benson-cream">
            <span>Oregon CCB #{company.ccbNumber}</span>
            <span>•</span>
            <span>{company.legalName}</span>
            <span>•</span>
            <span>Practical Repair, Restoration & Maintenance</span>
          </div>
        </div>
      </div>
    </header>
  );
}
