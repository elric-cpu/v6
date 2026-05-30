"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { company } from "@/data/company";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/plans", label: "Plans" },
    { href: "/areas", label: "Service Areas" },
    { href: "/how-we-work", label: "How We Work" },
    { href: "/resources", label: "Resources" },
    { href: "/tools/subscription-recommendation", label: "Tools" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-benson-charcoal text-benson-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-cream focus-visible:ring-offset-2 focus-visible:ring-offset-benson-charcoal"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg border border-benson-pale bg-benson-offwhite px-1.5 py-1 shadow-sm sm:w-16">
              <Image
                src="/benson-enterprises-logo.svg"
                alt={`${company.brandName} logo`}
                width={64}
                height={44}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-benson-offwhite">
                {company.brandName}
              </p>
              <p className="text-xs text-benson-pale">
                Oregon CCB #{company.ccbNumber}
              </p>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded text-benson-offwhite transition-colors duration-200 ease-out hover:text-benson-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-cream focus-visible:ring-offset-2 focus-visible:ring-offset-benson-charcoal"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-4">
            <a
              href={company.phoneHref}
              className="rounded text-sm text-benson-offwhite transition-colors duration-200 ease-out hover:text-benson-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-cream focus-visible:ring-offset-2 focus-visible:ring-offset-benson-charcoal"
            >
              {company.phoneDisplay}
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-benson-maroon px-4 py-2 text-sm font-medium text-benson-offwhite shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-benson-maroon-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-cream focus-visible:ring-offset-2 focus-visible:ring-offset-benson-charcoal active:translate-y-px"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-benson-offwhite transition-colors duration-200 ease-out hover:bg-benson-wine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-cream focus-visible:ring-offset-2 focus-visible:ring-offset-benson-charcoal xl:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? "M6 18 18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`${menuOpen ? "block" : "hidden"} border-t border-benson-wine bg-benson-charcoal xl:hidden`}
      >
        <div className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-benson-offwhite transition-colors duration-200 ease-out hover:bg-benson-wine hover:text-benson-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-cream focus-visible:ring-offset-2 focus-visible:ring-offset-benson-charcoal"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={company.phoneHref}
            className="mt-2 rounded-lg border border-benson-burgundy px-3 py-3 text-center font-medium text-benson-offwhite transition-colors duration-200 ease-out hover:bg-benson-wine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-cream focus-visible:ring-offset-2 focus-visible:ring-offset-benson-charcoal"
          >
            {company.phoneDisplay}
          </a>
        </div>
      </nav>

      <div className="bg-benson-wine">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm text-benson-cream">
            <span>Oregon CCB #{company.ccbNumber}</span>
            <span>{company.legalName}</span>
            <span>Harney County route planning</span>
          </div>
        </div>
      </div>
    </header>
  );
}
