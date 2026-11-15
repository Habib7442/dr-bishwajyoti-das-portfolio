import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { Ear } from "lucide-react";
import { intro, site, type IntroLine } from "@/data/site";
import { isTodo, telHref, whatsappNumber } from "@/lib/site-helpers";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/pill";
import { RotatingBadge } from "@/components/ui/rotating-badge";
import { Asterisk } from "@/components/ui/text-bits";
import { AccentWord, BookScrollPill, FadeUp, PillPop, StatementLine, StatsRow } from "./IntroMotion";

/** Local /public image present at build time? (fallback pill otherwise) */
const publicFileExists = (src: string) => src.startsWith("/") && existsSync(join(process.cwd(), "public", src));

const pillClass =
  "ml-3 inline-flex h-[0.8em] w-[1.6em] translate-y-[0.05em] items-center justify-center overflow-hidden rounded-full align-middle ring-2 ring-accent";

function ImagePill({ src, index }: { src: string; index: number }) {
  const hasPhoto = publicFileExists(src);
  return (
    <PillPop index={index} className={cn(pillClass, "relative", !hasPhoto && "bg-tint-1 text-primary")}>
      {hasPhoto ? (
        <Image src={src} alt="" fill sizes="120px" className="object-cover object-center" />
      ) : (
        <Ear className="size-[0.5em]" strokeWidth={1.5} aria-hidden />
      )}
    </PillPop>
  );
}

function Line({ line, index }: { line: IntroLine; index: number }) {
  return (
    <StatementLine index={index} className={cn("block", line.indent === 1 && "md:pl-[12%]")}>
      {line.asterisk && <Asterisk className="mr-3 animate-[spin_12s_linear_infinite] motion-reduce:animate-none" />}
      {line.accent || line.pill ? (
        <span className="whitespace-nowrap">
          {line.accent ? <AccentWord index={index}>{line.text}</AccentWord> : line.text}
          {line.pill && <ImagePill src={line.pill} index={index} />}
        </span>
      ) : (
        line.text
      )}{" "}
    </StatementLine>
  );
}

export function Intro() {
  const stats = intro.stats.filter((s) => !isTodo(s.value));
  // only "6 days" confirmed (or nothing) → hide the whole row
  const showStats = stats.some((s) => s.value !== "6 days");
  const bookLabel = whatsappNumber ? "Book on WhatsApp" : "Book Online";

  return (
    <section id="about-intro" aria-labelledby="intro-title" className="relative overflow-hidden bg-primary pt-28 pb-24 text-white md:pt-36 md:pb-28">
      {/* half off the right edge; centred on lines 3–4 ("and every / allergy"):
          section pt (9rem at md+) + 3 line-heights (1.05 × the h2 font size) */}
      <div
        aria-hidden
        className="absolute right-0 hidden translate-x-1/2 -translate-y-1/2 lg:block"
        style={{ top: "calc(9rem + 3.15 * clamp(2.25rem, 5.2vw, 4rem))" }}
      >
        <RotatingBadge variant="outline" id="intro" className="size-[220px] md:size-[220px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <h2
            id="intro-title"
            className="font-heading text-[clamp(2.25rem,5.2vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em] text-white"
          >
            {intro.statementLines.map((line, i) => (
              <Line key={line.text} line={line} index={i} />
            ))}
          </h2>

          <FadeUp delay={0.4} className="mt-10 md:mt-14 md:grid md:grid-cols-12 md:gap-6">
            <div className="md:col-span-8 md:col-start-5 lg:col-span-6 lg:col-start-6">
              <p className="max-w-[34ch] text-[15px] leading-[1.65] text-white/80">{intro.paragraph}</p>

              <div className="mt-8">
                <p className="flex items-center gap-3 text-xs tracking-[0.08em] text-white/70 uppercase">
                  <span aria-hidden className="h-px w-16 bg-white/40" />
                  {intro.ctaLabel}
                </p>
                <div className="mt-3 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
                  {telHref && (
                    <a
                      href={telHref}
                      aria-label={`Call ${site.name}`}
                      className="font-heading text-[22px] font-medium whitespace-nowrap text-accent underline decoration-accent/60 underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-accent"
                    >
                      {site.phone}
                    </a>
                  )}
                  {whatsappNumber ? (
                    <BookScrollPill className="inline-flex h-11 items-center whitespace-nowrap justify-center rounded-full bg-accent px-6 text-[13px] font-medium text-primary transition duration-200 ease-out hover:-translate-y-px hover:bg-accent-dark focus-visible:outline-accent motion-reduce:hover:translate-y-0">
                      {bookLabel}
                    </BookScrollPill>
                  ) : (
                    <Pill href={site.onlineBooking} variant="accent">
                      {bookLabel}
                    </Pill>
                  )}
                </div>
              </div>
            </div>
          </FadeUp>

          {showStats && <StatsRow stats={stats} />}
        </div>
      </div>
    </section>
  );
}
