import Image from "next/image";
import { Clock, IndianRupee, MapPin } from "lucide-react";
import { quickFacts, site } from "@/data/site";
import { RotatingBadge } from "@/components/ui/rotating-badge";
import { BookingCard } from "./BookingCard";
import { BadgeIn, FadeIn, HeroBackdrop, HeroHeadline } from "./HeroMotion";

const facts = [
  { icon: MapPin, text: quickFacts.place },
  { icon: Clock, text: quickFacts.hours },
  { icon: IndianRupee, text: quickFacts.fee },
];

export function Hero() {
  return (
    <section id="home" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-cream pt-24 pb-12">
      {/* fallback while/if the illustration is missing: cream + soft peach blob */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30 bg-cream bg-[radial-gradient(ellipse_50%_60%_at_70%_45%,var(--color-peach)_0%,transparent_70%)] opacity-60"
      />
      <HeroBackdrop>
        <Image
          src={site.images.hero.src}
          alt={site.images.hero.alt}
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          quality={80}
          className="object-cover object-[60%_50%]"
        />
      </HeroBackdrop>
      {/* readability overlay: full wash on mobile, left→right fade on desktop */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-cream/85 lg:bg-transparent lg:bg-gradient-to-r lg:from-cream/75 lg:via-cream/25 lg:to-transparent" />
      {/* lg+: soft cream glow only behind the headline block so rust text keeps AA contrast over the ear */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_32%_42%_at_35%_50%,var(--color-cream)_35%,transparent_100%)] opacity-80 lg:block"
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.04]" />

      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:items-start lg:gap-6 lg:px-16">
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
            <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-ink/80">{site.heroSub}</p>
          </FadeIn>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Chamber details">
            {facts.map(({ icon: Icon, text }, i) => (
              <li key={text}>
                <FadeIn delay={1.2 + i * 0.08} y={12} duration={0.5}>
                  <span className="inline-flex h-9 items-center gap-2 rounded-full border border-rust/15 bg-white/70 px-4 text-[13px] text-rust backdrop-blur">
                    <Icon className="size-4" strokeWidth={1.5} aria-hidden />
                    {text}
                  </span>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: booking card (+ badge overlapping its bottom-left edge on desktop) */}
        <div className="relative mx-auto w-full max-w-[440px] lg:col-span-5 lg:mr-0">
          <FadeIn delay={0.5} y={32} duration={0.8}>
            <BookingCard />
          </FadeIn>
          {/* 96px badge, ~30% of it over the card's bottom-left corner */}
          <BadgeIn className="absolute -bottom-[67px] -left-[67px] hidden lg:block">
            <RotatingBadge id="hero" className="size-24 md:size-24" />
          </BadgeIn>
        </div>
      </div>
    </section>
  );
}
