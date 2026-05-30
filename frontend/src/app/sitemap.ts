import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { allPublicRoutes } from "@/data/siteRoutes";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return allPublicRoutes.map((pathname) => ({
    url: `${company.siteUrl}${pathname}`,
    lastModified,
  }));
}
