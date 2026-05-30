import type { Metadata } from "next";
import { company } from "@/data/company";

const defaultShareImage = {
  url: "/site-images/window-replacement-exterior.jpg",
  width: 1200,
  height: 1600,
  alt: `${company.brandName} project photo`,
} as const;

function trimToWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const trimmed = value.slice(0, maxLength - 1);
  const lastSpace = trimmed.lastIndexOf(" ");

  return `${(lastSpace > maxLength * 0.6 ? trimmed.slice(0, lastSpace) : trimmed).trimEnd()}…`;
}

export function buildVerificationMetadata(): Pick<Metadata, "verification" | "other"> {
  const googleVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
  const bingVerification = process.env.NEXT_PUBLIC_BING_VERIFICATION;

  return {
    ...(googleVerification
      ? {
          verification: {
            google: googleVerification,
          },
        }
      : {}),
    ...(bingVerification
      ? {
          other: {
            "msvalidate.01": bingVerification,
          },
        }
      : {}),
  };
}

export function buildPageMetadata(
  title: string,
  description: string,
  pathname = "/",
): Metadata {
  return {
    title,
    description: trimToWordBoundary(description, 155),
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      type: "website",
      title,
      description: trimToWordBoundary(description, 155),
      url: pathname,
      siteName: company.brandName,
      images: [defaultShareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: trimToWordBoundary(description, 155),
      images: [defaultShareImage.url],
    },
  };
}
