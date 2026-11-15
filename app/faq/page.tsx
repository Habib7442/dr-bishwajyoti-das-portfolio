import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { pages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: pages.faq.title, description: pages.faq.description, path: "/faq" });

// No FAQPage JSON-LD here: the same questions are on the home page, which carries the markup (once per site).
export default function FaqPage() {
  return (
    <main>
      <Faq headingAs="h1" />
      <Cta />
    </main>
  );
}
