import type { MetadataRoute } from "next";
import { reviewsState } from "@/data/reviews";
import { scopeViews } from "@/data/scopeViews";
import { site } from "@/data/site";

// no lastModified: new Date() would break the prerender with cacheComponents on
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "monthly" | "yearly" = "monthly") => ({
    url: `${site.url}${path}`,
    changeFrequency,
    priority,
  });
  return [
    page("", 1),
    page("/services", 0.8),
    page("/about", 0.8),
    page("/chamber", 0.8),
    page("/book", 0.8),
    page("/faq", 0.6),
    page("/gallery", 0.6),
    ...scopeViews.map((v) => page(`/gallery/${v.slug}`, 0.5)),
    // /reviews is a 404 until there are real reviews
    ...(reviewsState() === "hidden" ? [] : [page("/reviews", 0.6)]),
    page("/privacy", 0.3, "yearly"),
  ];
}
