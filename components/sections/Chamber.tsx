import { Check, Navigation } from "lucide-react";
import { chamber, site } from "@/data/site";
import { isTodo, telHref, whatsappUrl } from "@/lib/site-helpers";
import { cn } from "@/lib/utils";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { Pill } from "@/components/ui/pill";
import { ChamberStatus } from "./ChamberStatus";
import { ChamberTitle, MapCard, ScheduleList } from "./ChamberMotion";

const query = encodeURIComponent(chamber.mapsQuery);
// AGENTS.md §6: plain iframe embed; prefer the official embed URL once it's filled in
const mapSrc = isTodo(site.mapEmbed) ? `https://www.google.com/maps?q=${query}&output=embed` : site.mapEmbed;
const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

const labelClass = "text-[11px] tracking-[0.08em] text-white/60 uppercase";

/** `headingAs="h1"` on /chamber, where it is the whole page (extra top padding clears the fixed navbar) */
export function Chamber({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const wa = whatsappUrl(chamber.whatsappMessage);
  const pad = headingAs === "h1" ? "pt-36 pb-24 md:pb-36" : "py-24 md:py-36";

  return (
    <section id="contact" aria-labelledby="chamber-title" className={cn("relative overflow-hidden bg-primary text-white", pad)}>
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-16">
        {/* Left: info */}
        <div className="lg:col-span-6">
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-white/70 uppercase">
            <span aria-hidden className="h-px w-6 bg-white/40" />
            {chamber.eyebrow}
          </p>
          <ChamberTitle
            id="chamber-title"
            as={headingAs}
            line1={chamber.titleLine1}
            line2={chamber.titleLine2}
            className="mt-4 font-heading text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] font-medium tracking-[-0.03em]"
          />
          <p className="mt-6 max-w-[40ch] text-[15px] leading-[1.65] text-white/80">{chamber.intro}</p>

          <ChamberStatus schedule={chamber.schedule} timeZone={chamber.timeZone} className="mt-6" />

          <ScheduleList schedule={chamber.schedule} timeZone={chamber.timeZone} className="mt-8 max-w-[440px]" />

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <p className={labelClass}>Consultation fee</p>
              <p className="mt-2 font-heading text-[40px] leading-none font-medium text-accent">{chamber.fee}</p>
              <p className="mt-2 text-[13px] text-white/70">{chamber.feeNote}</p>
            </div>
            <div>
              <p className={labelClass}>Please bring</p>
              <ul className="mt-3 space-y-2">
                {chamber.bringList.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-[1.5] text-white/85">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Pill href={wa ?? site.onlineBooking} variant="accent">
              <WhatsApp aria-hidden />
              {wa ? "Book on WhatsApp" : "Book Online"}
            </Pill>
            {telHref && (
              <Pill href={telHref} variant="outline-light">
                Call {site.phone}
              </Pill>
            )}
            <a
              href={site.onlineBooking}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center px-2 text-sm text-white/80 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline-accent"
            >
              Book online →
            </a>
          </div>
        </div>

        {/* Right: map card + address row underneath (nothing on top of the map) */}
        <div className="flex flex-col lg:col-span-6">
          <MapCard
            src={mapSrc}
            title={`Map to ${chamber.hospital}, ${chamber.address.replace(", Assam", "")}`}
            placeName={chamber.hospital}
            className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-base lg:aspect-auto lg:min-h-[620px] lg:flex-1"
          />
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-heading text-xl font-medium">{chamber.hospital}</p>
              <p className="text-sm text-white/70">{chamber.address}</p>
            </div>
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get directions"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-primary transition-colors hover:bg-accent-dark focus-visible:outline-accent"
            >
              <Navigation aria-hidden className="size-5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
