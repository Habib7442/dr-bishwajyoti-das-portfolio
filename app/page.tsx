import { About } from "@/components/sections/About";
import { Chamber } from "@/components/sections/Chamber";
import { FloatingWhatsApp } from "@/components/sections/FloatingWhatsApp";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Navbar } from "@/components/sections/Navbar";
import { Services } from "@/components/sections/Services";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { nav, site } from "@/data/site";

// Sections are added one approved prompt at a time (see prompts/).

export default function Home() {
  return (
    <>
      <Navbar name={site.name} links={nav} />
      <main>
        <Hero />
        <Intro />
        <Services />
        <About />
        <Chamber />
        <WhoWeHelp />
      </main>
      <FloatingWhatsApp />
    </>
  );
}
