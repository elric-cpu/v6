import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { brandTagline, company } from "@/data/company";
import { buildVerificationMetadata } from "@/lib/metadata";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: `${company.brandName} | Practical Repair, Restoration & Maintenance`,
    template: `%s | ${company.brandName}`,
  },
  description: `${brandTagline} Serving Harney County and planned monthly South County routes. Oregon CCB #${company.ccbNumber}.`,
  keywords:
    "Harney County repair, Burns Oregon contractor, Hines Oregon maintenance, South County routes, window screen repair, CCB 258533",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  ...buildVerificationMetadata(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-benson-offwhite text-benson-charcoal antialiased`}
      >
        <GoogleAnalytics />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
