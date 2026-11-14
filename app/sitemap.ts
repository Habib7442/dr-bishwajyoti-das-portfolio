import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// no lastModified: new Date() would break the prerender with cacheComponents on
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
