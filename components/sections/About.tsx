import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { Ear, HandHeart, MessagesSquare, type LucideIcon } from "lucide-react";
import { about, site, type ApproachIcon } from "@/data/site";
import { isTodo, telHref } from "@/lib/site-helpers";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { BookScrollPill } from "./IntroMotion";
import { ArchReveal, RevealGroup, RevealItem, StatementHeading } from "./AboutMotion";

const approachIcons: Record<ApproachIcon, LucideIcon> = { Ear, MessagesSquare, HandHeart };
const cardColors = ["bg-base", "bg-tint-3", "bg-tint-1"];

/** Local /public file present at build time? (monogram fallback otherwise) */
const publicFileExists = (src: string) => src.startsWith("/") && existsSync(join(process.cwd(), "public", src));

/** "15" → "15+ years"; anything else is shown as written */
const years = (v: string) => (/^\d+$/.test(v.trim()) ? `${v.trim()}+ years` : v);

// semicircle top + 32px bottom corners on a 4:5 box. `rounded-t-full rounded-b-[32px]` would make
// the browser scale every radius down (sum > height) and flatten the bottom corners to ~0.
const archShape = "rounded-[50%_50%_32px_32px/40%_40%_32px_32px]";

function ArchPhoto() {
  const hasPhoto = publicFileExists(about.portrait);
  return (
    <ArchReveal
      className="relative mx-auto aspect-[4/5] w-full max-w-[300px] lg:max-w-[440px]"
      archClassName={cn("absolute inset-0 overflow-hidden bg-base", archShape)}
    >
      {hasPhoto ? (
        <Image
          src={about.portrait}
          alt={about.portraitAlt}
          fill
          sizes="(min-width: 1024px) 440px, 300px"
          className="object-cover object-[50%_12%]"
        />
      ) : (
        <span
          role="img"
          aria-label={about.portraitAlt}
          className="absolute inset-0 grid place-items-center font-heading text-[120px] font-semibold tracking-[-0.04em] text-primary"
        >
          <span aria-hidden>BD</span>
        </span>
      )}
    </ArchReveal>
  );
}

function Text({ headingAs }: { headingAs: "h1" | "h2" }) {
  const hasQual = !isTodo(about.qualifications);
  const bio = about.bio.filter((p) => !isTodo(p));
  const NameTag = headingAs === "h1" ? "h2" : "h3";
  return (
    <div>
      <p className="flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-ink/70 uppercase">
        <span aria-hidden className="h-px w-6 bg-ink/40" />
        {about.eyebrow}
      </p>
      <StatementHeading
        id="about-title"
        as={headingAs}
        lead={about.statement.lead}
        accent={about.statement.accent}
        className="mt-4 font-heading text-[clamp(2.5rem,5vw,4.25rem)] leading-none font-medium tracking-[-0.03em] text-ink"
      />

      <RevealGroup stagger={0.1}>
        <RevealItem className="mt-12 border-l-2 border-primary pl-4">
          <NameTag className="font-heading text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-primary">{about.name}</NameTag>
          <p className="mt-1 text-sm text-ink/80">{about.role}</p>
          {hasQual && <p className="mt-1 text-[13px] text-ink/70">{about.qualifications}</p>}
        </RevealItem>

        {bio.length > 0 && (
          <RevealItem className="mt-6 max-w-[48ch] space-y-4 text-[15px] leading-[1.7] text-ink/85">
            {bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </RevealItem>
        )}

        <RevealItem className="mt-8 flex flex-wrap gap-3">
          <BookScrollPill className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-[13px] font-medium text-white transition duration-200 ease-out hover:-translate-y-px hover:bg-primary-dark motion-reduce:hover:translate-y-0">
            Book an appointment
          </BookScrollPill>
          {telHref && (
            <a
              href={telHref}
              className="inline-flex h-11 items-center justify-center rounded-full border border-ink/25 px-6 text-[13px] font-medium text-ink transition duration-200 ease-out hover:bg-white/30"
            >
              Call {site.phone}
            </a>
          )}
        </RevealItem>
      </RevealGroup>
    </div>
  );
}

function ApproachCards({ titleAs }: { titleAs: "h3" | "h4" }) {
  const Title = titleAs;
  return (
    <RevealGroup
      stagger={0.1}
      role="list"
      tabIndex={0}
      aria-label="How Dr. Das treats patients"
      className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] focus-visible:outline-offset-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
    >
      {about.approach.map((a, i) => {
        const Icon = approachIcons[a.icon];
        return (
          <RevealItem
            key={a.title}
            as="article"
            role="listitem"
            y={32}
            className={cn(
              "flex min-h-[240px] w-[82%] shrink-0 snap-start flex-col justify-between rounded-[28px] p-6 transition-[translate] duration-300 ease-out md:w-auto md:p-8",
              "[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1.5 motion-reduce:hover:translate-y-0",
              cardColors[i % cardColors.length],
            )}
          >
            <div className="flex items-start justify-between">
              <span aria-hidden className="font-heading text-[64px] leading-none font-semibold tracking-[-0.04em] text-primary/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden className="grid size-12 place-items-center rounded-full bg-primary text-white">
                <Icon className="size-[22px]" strokeWidth={1.5} />
              </span>
            </div>
            <div className="mt-8">
              <Title className="font-heading text-[26px] leading-[1.15] font-medium tracking-[-0.01em] text-primary">{a.title}</Title>
              <p className="mt-2 text-sm leading-[1.6] text-ink/80">{a.text}</p>
            </div>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

function InfoBar() {
  const items = about.info
    .filter((it) => !isTodo(it.value))
    .map((it) => (it.label === "Experience" ? { ...it, value: years(it.value) } : it));
  const odd = items.length % 2 === 1;
  return (
    <RevealGroup
      as="dl"
      fade
      className="grid grid-cols-2 gap-y-4 rounded-[28px] bg-white px-6 py-6 md:flex md:gap-y-0 md:divide-x md:divide-primary/15 md:px-10"
    >
      {items.map((it, i) => (
        <div
          key={it.label}
          className={cn(
            "md:flex-1 md:px-6 md:first:pl-0 md:last:pr-0",
            i % 2 === 0 ? "pr-4" : "pl-4",
            i >= 2 && "border-t border-primary/10 pt-4 md:border-t-0 md:pt-0",
            odd && i === items.length - 1 && "col-span-2 pl-0",
          )}
        >
          <dt className="text-[11px] tracking-[0.08em] text-ink/60 uppercase">{it.label}</dt>
          <dd className="mt-1 font-heading text-lg leading-[1.25] font-medium text-primary">{it.value}</dd>
        </div>
      ))}
    </RevealGroup>
  );
}

/** `headingAs="h1"` on /about, where the statement is the page title */
export function About({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-section pt-36 pb-12">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ArchPhoto />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Text headingAs={headingAs} />
          </div>
        </div>

        <div className="mt-24">
          <ApproachCards titleAs={headingAs === "h1" ? "h3" : "h4"} />
        </div>

        <div className="mt-6">
          <InfoBar />
        </div>
      </div>

      {/* accent ribbon closing the section; wider than the viewport, clipped by the section */}
      <div className="relative mt-24 -mx-[5vw]">
        <Marquee
          items={about.marquee}
          className="-rotate-2 bg-accent py-4 font-heading text-[clamp(1.75rem,4vw,3rem)] leading-none font-semibold tracking-[-0.02em] text-primary md:py-6"
          glyphClassName="text-primary/40"
        />
      </div>
    </section>
  );
}
