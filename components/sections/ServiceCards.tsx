import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bookingPageHref } from "@/lib/scroll-to-booking";
import { serviceRows } from "./Services";
import { Fallback } from "./ServicesMotion";
import { RevealGroup, RevealItem } from "./AboutMotion";

/** /services: every service as a card (1 / 2 / 3 columns). `id={slug}` is the footer Treatments target. */
export function ServiceCards() {
  const rows = serviceRows();
  return (
    <RevealGroup stagger={0.08} role="list" aria-label="Services" className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((s, i) => (
        <RevealItem key={s.slug} as="article" role="listitem" id={s.slug} y={32} className="flex flex-col rounded-[28px] bg-white p-6 md:p-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
            {s.hasImage ? (
              <Image
                src={s.image}
                alt={s.imageAlt}
                fill
                sizes="(min-width: 1280px) 340px, (min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            ) : (
              <Fallback s={s} index={i} />
            )}
          </div>
          <h2 className="mt-6 font-heading text-[26px] leading-[1.15] font-medium tracking-[-0.01em] text-primary">{s.title}</h2>
          <p className="mt-2 flex-1 text-[15px] leading-[1.65] text-ink/80">{s.short}</p>
          <Link
            href={bookingPageHref(s.problem)}
            aria-label={`Book an appointment for ${s.title}`}
            className="group/link mt-6 inline-flex h-11 items-center gap-1.5 self-start text-sm font-medium text-primary"
          >
            <span className="underline-offset-4 group-hover/link:underline">Book for this</span>
            <ArrowRight
              aria-hidden
              strokeWidth={1.5}
              className="size-4 transition-transform duration-200 ease-out group-hover/link:translate-x-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0 motion-reduce:group-focus-visible/link:translate-x-0"
            />
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
