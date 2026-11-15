import { Suspense } from "react";
import { Cta } from "@/components/sections/Cta";
import { serviceRows } from "@/components/sections/Services";
import { ServicesFilterable, ServicesGrid, type ServicesHelp } from "@/components/sections/ServicesExplorer";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { pages, servicesIntro, site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { telHref, whatsappUrl } from "@/lib/site-helpers";

const page = pages.services;

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/services" });

export default function ServicesPage() {
  const rows = serviceRows();
  const help: ServicesHelp = {
    eyebrow: page.help.eyebrow,
    chat: page.help.chat,
    title: page.help.title,
    text: page.help.text,
    whatsappLabel: page.help.whatsappLabel,
    whatsappHref: whatsappUrl(page.help.whatsappMessage) ?? site.onlineBooking,
    quickLabel: page.help.quickLabel,
    // each pill opens WhatsApp with its question prefilled; none while the WhatsApp number is TODO
    quick: page.help.quickQuestions.flatMap((q) => {
      const href = whatsappUrl(q);
      return href ? [{ label: q, href }] : [];
    }),
    call: telHref ? { href: telHref, label: `Call ${site.phone}` } : null,
  };
  const grid = { rows, help, filterLabel: page.filterLabel };

  return (
    <main>
      <section aria-labelledby="services-page-title" className="bg-base pt-36 pb-20 md:pb-24">
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

          {/* ?type=… is read on the client; the prerendered fallback lists every service (good for SEO and no-JS) */}
          <Suspense fallback={<ServicesGrid {...grid} />}>
            <ServicesFilterable {...grid} />
          </Suspense>
        </div>
      </section>
      <WhoWeHelp />
      <Cta />
    </main>
  );
}
