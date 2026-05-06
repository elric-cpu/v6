import type { Metadata } from "next";

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
): Metadata {
  return {
    title,
    description,
  };
}
