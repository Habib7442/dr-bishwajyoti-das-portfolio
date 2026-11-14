import { About } from "@/components/sections/About";
import { Chamber } from "@/components/sections/Chamber";
import { FloatingWhatsApp } from "@/components/sections/FloatingWhatsApp";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Navbar } from "@/components/sections/Navbar";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { reviewsState } from "@/data/reviews";
import { nav, site } from "@/data/site";

// Sections are added one approved prompt at a time (see prompts/).

export default function Home() {
  // no real reviews and no review/listing links → no Reviews section, so drop its nav link too
  const links = reviewsState() === "hidden" ? nav.filter((l) => l.href !== "#reviews") : nav;

  return (
    <>
      <Navbar name={site.name} links={links} />
      <main>
        <Hero />
        <Intro />
        <Services />
        <About />
        <Chamber />
        <WhoWeHelp />
        <Reviews />
      </main>
      <FloatingWhatsApp />
    </>
  );
}
