import { notFound } from "next/navigation";
import { Cta } from "@/components/sections/Cta";
import { Reviews } from "@/components/sections/Reviews";
import { reviewsState } from "@/data/reviews";
import { pages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: pages.reviews.title, description: pages.reviews.description, path: "/reviews" });

/**
 * Real reviews only (data/reviews.ts). While there are none and no review/listing link, this page is a 404,
 * and the layout drops its nav/footer links and the sitemap leaves it out.
 */
export default function ReviewsPage() {
  if (reviewsState() === "hidden") notFound();
  return (
    <main>
      <Reviews headingAs="h1" />
      <Cta />
    </main>
  );
}
