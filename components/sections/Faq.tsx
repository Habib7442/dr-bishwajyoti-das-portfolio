import { faq, site } from "@/data/site";
import { telHref, whatsappUrl } from "@/lib/site-helpers";
import { cn } from "@/lib/utils";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { Pill } from "@/components/ui/pill";
import { AccentWord, RevealHeader } from "./ReviewsMotion";
import { FaqList } from "./FaqMotion";

/** `headingAs="h1"` on /faq, where it is the whole page (extra top padding clears the fixed navbar) */
export function Faq({ headingAs: Heading = "h2" }: { headingAs?: "h1" | "h2" }) {
  const wa = whatsappUrl(faq.whatsappMessage);
  const pad = Heading === "h1" ? "pt-36 pb-24 md:pb-36" : "py-24 md:py-36";

  return (
    <section id="faq" aria-labelledby="faq-title" className={cn("relative border-t border-primary/10 bg-white", pad)}>
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-16">
        <RevealHeader className="self-start lg:sticky lg:top-24 lg:col-span-5">
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-ink/60 uppercase">
            <span aria-hidden className="h-px w-6 bg-primary/40" />
            {faq.eyebrow}
          </p>
          <Heading
            id="faq-title"
            className="mt-4 font-heading text-[clamp(2.5rem,5vw,4rem)] leading-none font-medium tracking-[-0.03em] text-ink"
          >
            {faq.titleLead} <AccentWord><span className="text-primary">{faq.titleAccent}</span></AccentWord>
          </Heading>
          <p className="mt-6 max-w-[34ch] text-[15px] leading-[1.65] text-ink/75">{faq.intro}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Pill
              href={wa ?? site.onlineBooking}
              variant="accent"
              className="w-full focus-visible:outline-primary sm:w-auto"
            >
              <WhatsApp aria-hidden />
              {wa ? "Ask on WhatsApp" : "Book Online"}
            </Pill>
            {telHref && (
              <a
                href={telHref}
                className="inline-flex h-11 items-center justify-center rounded-sm text-sm font-medium text-primary underline underline-offset-4 hover:text-primary-dark focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Call {site.phone}
              </a>
            )}
          </div>
        </RevealHeader>

        <div className="lg:col-span-7">
          <FaqList items={faq.items} />
        </div>
      </div>
    </section>
  );
}
