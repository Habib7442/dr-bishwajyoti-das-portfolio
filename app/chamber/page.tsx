import { Chamber } from "@/components/sections/Chamber";
import { Cta } from "@/components/sections/Cta";
import { pages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: pages.chamber.title, description: pages.chamber.description, path: "/chamber" });

export default function ChamberPage() {
  return (
    <main>
      {/* "Visit the Chamber" is this page's h1 */}
      <Chamber headingAs="h1" />
      <Cta />
    </main>
  );
}
