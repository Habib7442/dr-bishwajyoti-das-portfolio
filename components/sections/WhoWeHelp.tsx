import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { ArrowRight, Baby, HeartHandshake, User, type LucideIcon } from "lucide-react";
import { whoWeHelp, type WhoGroup } from "@/data/site";
import { cn } from "@/lib/utils";
import { BookForLink } from "@/components/ui/book-for-link";
import { CardItem, CardsGrid, FadeUpBlock, ImageSettle, WhoTitle } from "./WhoWeHelpMotion";

/** Local /public file present at build time? (icon fallback otherwise) */
const publicFileExists = (src: string) => src.startsWith("/") && existsSync(join(process.cwd(), "public", src));

// one big soft corner per card (client: no blobs or circles)
const shape: Record<WhoGroup["key"], string> = {
  children: "rounded-[22px_120px_22px_22px]",
  adults: "rounded-[120px_22px_22px_22px]",
  seniors: "rounded-[22px_22px_120px_22px]",
};
const fallbackIcon: Record<WhoGroup["key"], LucideIcon> = { children: Baby, adults: User, seniors: HeartHandshake };
const panelBg: Record<WhoGroup["bg"], string> = { peach: "bg-peach", butter: "bg-butter", sky: "bg-sky" };
const tagBg: Record<WhoGroup["bg"], string> = { peach: "bg-peach/30", butter: "bg-butter/40", sky: "bg-sky/50" };

function Card({ g }: { g: WhoGroup }) {
  const hasPhoto = publicFileExists(g.image);
  const Icon = fallbackIcon[g.key];
  return (
    <CardItem className="group flex flex-col rounded-[28px] bg-white p-4 pb-8 transition-[translate] duration-300 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1.5 motion-reduce:hover:translate-y-0">
      <div
        className={cn("relative aspect-[16/10] overflow-hidden lg:aspect-[4/3]", shape[g.key], panelBg[g.bg])}
        {...(hasPhoto ? {} : { role: "img", "aria-label": g.imageAlt })}
      >
        <ImageSettle>
          {hasPhoto ? (
            <Image
              src={g.image}
              alt={g.imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-[scale] duration-[400ms] ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
            />
          ) : (
            <span aria-hidden className="grid h-full place-items-center text-rust">
              <Icon className="size-16" strokeWidth={1.5} />
            </span>
          )}
        </ImageSettle>
      </div>

      <div className="mt-6 flex flex-1 flex-col px-3 text-center">
        <h3 className="font-heading text-[26px] leading-[1.15] font-medium tracking-[-0.01em] text-rust">{g.title}</h3>
        <p className="mx-auto mt-2 max-w-[34ch] text-sm leading-[1.6] text-ink/75">{g.text}</p>
        <ul className="mt-4 flex flex-nowrap justify-center gap-2">
          {g.conditions.map((c) => (
            // lg–xl cards are narrowest (3 columns): smaller tags so all 3 stay on one line
            <li
              key={c}
              className={cn(
                "inline-flex h-7 shrink-0 items-center rounded-full px-3 text-[12px] whitespace-nowrap text-ink lg:max-xl:px-2 lg:max-xl:text-[11px]",
                tagBg[g.bg],
              )}
            >
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-8">
          <BookForLink
            problem={g.problem}
            label={`Book an appointment for ${g.title}: ${g.problem} problem`}
            className="group/link inline-flex h-11 items-center gap-1.5 text-sm font-medium text-rust"
          >
            <span className="underline-offset-4 group-hover/link:underline">Book for {g.title}</span>
            <ArrowRight
              aria-hidden
              strokeWidth={1.5}
              className="size-4 transition-transform duration-200 ease-out group-hover/link:translate-x-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0 motion-reduce:group-focus-visible/link:translate-x-0"
            />
          </BookForLink>
        </div>
      </div>
    </CardItem>
  );
}

export function WhoWeHelp() {
  return (
    <section id="who-we-help" aria-labelledby="who-title" className="relative bg-lilac py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-16">
        <FadeUpBlock>
          <p className="text-xs font-medium tracking-[0.08em] text-ink/60 uppercase">{whoWeHelp.eyebrow}</p>
        </FadeUpBlock>
        <WhoTitle
          id="who-title"
          lead={whoWeHelp.titleLead}
          accent={whoWeHelp.titleAccent}
          className="mt-4 font-heading text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none font-medium tracking-[-0.03em] text-rust"
        />
        <FadeUpBlock>
          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-[1.65] text-ink/75">{whoWeHelp.intro}</p>
        </FadeUpBlock>

        <CardsGrid className="mt-16 grid gap-6 text-left lg:grid-cols-3">
          {whoWeHelp.groups.map((g) => (
            <Card key={g.key} g={g} />
          ))}
        </CardsGrid>
      </div>
    </section>
  );
}
