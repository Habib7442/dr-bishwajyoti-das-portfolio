import { Cta } from "@/components/sections/Cta";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { pages, servicesIntro } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

const page = pages.services;

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/services" });

export default function ServicesPage() {

  return (
    <>
      <main>
        <section aria-labelledby="services-page-title" className="bg-base pt-36 pb-24 md:pb-36">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
            <p className="flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-primary uppercase">
              <span aria-hidden className="h-px w-6 bg-primary" />
              {page.eyebrow}
            </p>
            <h1
              id="services-page-title"
              className="mt-6 font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-medium tracking-[-0.03em] text-primary"
            >
              {page.heading}
            </h1>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.65] text-ink/75">{servicesIntro}</p>

            <div className="mt-12 md:mt-16">
              <ServiceCards />
            </div>
          </div>
        </section>
        <WhoWeHelp />
        <Cta />
      </main>
    </>
  );
}
