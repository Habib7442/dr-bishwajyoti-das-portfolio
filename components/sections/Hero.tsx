import Image from "next/image";
import { Clock, IndianRupee, MapPin } from "lucide-react";
import { quickFacts, quickFactsShort, site } from "@/data/site";
import { BookingCard } from "./BookingCard";
import { FadeIn, HeroBackdrop, HeroHeadline } from "./HeroMotion";

const facts = [
  { icon: MapPin, text: quickFacts.place, short: quickFactsShort.place },
  { icon: Clock, text: quickFacts.hours, short: quickFactsShort.hours },
  { icon: IndianRupee, text: quickFacts.fee, short: quickFactsShort.fee },
];

export function Hero() {
  return (
    <section id="home" className="relative isolate flex items-center overflow-hidden bg-cream pt-24 pb-12 md:min-h-[100svh]">
      {/* fallback while/if the illustration is missing: cream + soft peach blob */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30 bg-cream bg-[radial-gradient(ellipse_50%_60%_at_70%_45%,var(--color-peach)_0%,transparent_70%)] opacity-60"
      />
      <HeroBackdrop>
        {/* phones: illustration covers only the top 640px (fading out), so the cochlea + nerves sit top-right
            behind the headline instead of behind the card; md+: full bleed */}
        <div className="absolute inset-x-0 top-0 h-[640px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] md:inset-0 md:h-auto md:[mask-image:none]">
          <Image
            src={site.images.hero.src}
            alt={site.images.hero.alt}
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            quality={80}
            className="object-cover object-[60%_20%] opacity-90 saturate-[0.85] md:object-[60%_50%] md:opacity-100 md:saturate-[0.9]"
          />
        </div>
      </HeroBackdrop>
      {/* readability overlay: full wash on phones/tablets, left→right fade on desktop */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-cream/45 md:bg-cream/85 lg:bg-transparent lg:bg-gradient-to-r lg:from-cream/75 lg:via-cream/25 lg:to-transparent" />
      {/* lg+: soft cream glow only behind the headline block so rust text keeps AA contrast over the ear */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_32%_42%_at_35%_50%,var(--color-cream)_35%,transparent_100%)] opacity-80 lg:block"
      />
      {/* phones: stronger cream behind the text block (top 60%) so the headline reads cleanly */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-3/5 bg-gradient-to-b from-cream/60 via-cream/40 to-transparent md:hidden" />
      {/* phones: cream fade over the bottom 40% so the booking card area stays clean */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-b from-transparent to-cream/80 md:hidden" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.04]" />

      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-8 px-6 md:gap-12 lg:grid-cols-12 lg:items-start lg:gap-6 lg:px-16">
        {/* Left: headline block */}
        <div className="lg:col-span-7">
          <FadeIn y={12} duration={0.6}>
            <p className="flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-rust uppercase">
              <span aria-hidden className="h-px w-6 bg-rust" />
              {site.heroEyebrow}
            </p>
          </FadeIn>

          <div className="mt-6">
            <HeroHeadline lines={["Clear Ears.", "Easy Breathing.", "Healthy Throat."]} highlight="Throat." />
          </div>

          <FadeIn delay={1.1}>
            <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-ink/80">
              {site.heroSub.startsWith(site.name) ? (
                <>
                  <strong className="font-semibold text-rust">{site.name}</strong>
                  {site.heroSub.slice(site.name.length)}
                </>
              ) : (
                site.heroSub
              )}
            </p>
          </FadeIn>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Chamber details">
            {facts.map(({ icon: Icon, text, short }, i) => (
              <li key={text}>
                <FadeIn delay={1.2 + i * 0.08} y={12} duration={0.5}>
                  <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-rust/15 bg-white/70 px-3 text-[12px] text-rust backdrop-blur md:h-9 md:gap-2 md:px-4 md:text-[13px]">
                    <Icon className="size-3.5 md:size-4" strokeWidth={1.5} aria-hidden />
                    <span className="md:hidden">{short}</span>
                    <span className="hidden md:inline">{text}</span>
                  </span>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: booking card */}
        <div className="relative mx-auto w-full max-w-[440px] lg:col-span-5 lg:mr-0">
          <FadeIn delay={0.5} y={32} duration={0.8}>
            <BookingCard />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
