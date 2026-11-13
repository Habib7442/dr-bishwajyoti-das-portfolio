import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { nav, site } from "@/data/site";

// Sections are added one approved prompt at a time (see prompts/).

export default function Home() {
  return (
    <>
      <Navbar name={site.name} links={nav} />
      <main>
        <Hero />
      </main>
    </>
  );
}
