import { About } from "@/components/sections/About";
import { Cta } from "@/components/sections/Cta";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { pages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: pages.about.title, description: pages.about.description, path: "/about" });

export default function AboutPage() {

  return (
    <>
      <main>
        {/* the "Good treatment starts with listening." statement is this page's h1 */}
        <About headingAs="h1" />
        <WhoWeHelp />
        <Cta />
      </main>
    </>
  );
}
