"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Service } from "@/data/site";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Asterisk } from "@/components/ui/text-bits";

const INITIAL = 5;

export function Services({ services }: { services: Service[] }) {
  const [open, setOpen] = useState<string[]>([services[0].slug]);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? services : services.slice(0, INITIAL);

  const hoverOpen = (slug: string) => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setOpen([slug]);
  };

  return (
    <section id="services" aria-labelledby="services-title" className="overflow-hidden bg-cream text-ink">
      <div className="mx-auto max-w-[1440px] px-4 pt-20 md:px-8 md:pt-32">
        <Reveal>
          <h2
            id="services-title"
            className="font-display -mr-[30vw] whitespace-nowrap text-[clamp(4rem,13vw,12rem)] text-rust"
          >
            Our Services <Asterisk className="text-rust" />
          </h2>
        </Reveal>

        <Accordion id="services-list" value={open} onValueChange={(v) => setOpen(v as string[])} className="mt-10 border-t border-rust/30 md:mt-16">
          {visible.map((s, i) => {
            const isOpen = open.includes(s.slug);
            return (
              <AccordionItem
                key={s.slug}
                value={s.slug}
                onMouseEnter={() => hoverOpen(s.slug)}
                className="group/row border-b border-rust/30 not-last:border-b"
              >
                <AccordionTrigger className="items-center gap-4 rounded-none py-5 hover:no-underline md:py-7 **:data-[slot=accordion-trigger-icon]:hidden">
                  <span className="w-10 shrink-0 font-heading text-sm font-medium text-rust/70 md:w-16 md:text-base">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "flex-1 font-heading text-[clamp(1.375rem,3.4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.03em] transition-colors",
                      isOpen ? "text-rust" : "text-ink group-hover/row:text-rust",
                    )}
                  >
                    {s.title}
                  </span>
                  <span
                    className={cn(
                      "relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-full transition-all duration-500 sm:block",
                      isOpen && "w-0 opacity-0",
                    )}
                    aria-hidden
                  >
                    <Image src={s.image.src} alt="" fill sizes="96px" className="object-cover" />
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-full border border-rust/40 text-rust transition-all duration-300",
                      isOpen && "rotate-90 border-rust bg-rust text-white",
                    )}
                  >
                    <ArrowUpRight className="size-5" />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-8">
                  <div className="grid gap-6 md:grid-cols-[4rem_1fr_minmax(0,1.1fr)] md:gap-8">
                    <span aria-hidden className="hidden md:block" />
                    <p className="max-w-md self-end text-base leading-relaxed text-ink/80">{s.description}</p>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem]">
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className={cn("object-cover transition-transform duration-700", isOpen ? "scale-100" : "scale-110")}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* curved divider into the lavender band, with the round "See All" button sitting on the curve */}
      <div className="relative mt-24 h-28 md:mt-32 md:h-44">
        <div aria-hidden className="absolute top-0 -left-1/4 h-[200%] w-[150%] rounded-[50%] bg-lavender" />
        {services.length > INITIAL && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            aria-controls="services-list"
            className="absolute top-0 left-1/2 z-10 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime text-center font-heading text-lg leading-tight font-semibold text-rust shadow-xl shadow-rust/20 transition-transform hover:scale-105 md:size-36 md:text-xl"
          >
            {showAll ? "Show Less" : (
              <span>
                See All
                <span className="block text-sm font-medium">{services.length} services</span>
              </span>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
