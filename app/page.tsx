import { About } from "@/components/sections/About";
import { Chamber } from "@/components/sections/Chamber";
import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { buildFaqJsonLd, jsonLdString } from "@/lib/seo";

// Navbar, Footer and the floating WhatsApp button live in app/layout.tsx.

export default function Home() {
  return (
    <>
      {/* site-wide Physician/Clinic/WebSite JSON-LD is in the layout; FAQPage only here (also shown on /faq,
          but the same FAQ is marked up once) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildFaqJsonLd()) }} />
      <main>
        <Hero />
        <Intro />
        <Services />
        <About />
        <Chamber />
        <WhoWeHelp />
        <Reviews />
        <Faq />
        <Cta />
      </main>
    </>
  );
}
