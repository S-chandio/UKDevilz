import type { MetadataRoute } from "next";
import { PAGE_SEO } from "@/lib/page-seo";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(PAGE_SEO).map((route) => ({
    url: new URL(route, `https://${SITE.domain}`).toString(),
  }));
}
