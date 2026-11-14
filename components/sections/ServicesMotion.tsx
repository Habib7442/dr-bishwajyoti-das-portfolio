"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ArrowRight, BedDouble, Ear, Flower2, Mic, Plus, RotateCw, ScanEye, Wind, type LucideIcon } from "lucide-react";
import type { Service, ServiceIcon } from "@/data/site";
import { ease } from "@/lib/motion";
import { useReveal } from "@/lib/use-reveal";
import { cn } from "@/lib/utils";
import { Accordion } from "@/components/ui/accordion";
import { BookForLink } from "@/components/ui/book-for-link";
import { CurveDivider } from "@/components/shapes/CurveDivider";

const icons: Record<ServiceIcon, LucideIcon> = { Ear, Wind, Flower2, Mic, RotateCw, BedDouble, ScanEye };
const fallbackBg = ["bg-peach/40", "bg-butter/50", "bg-lilac"];

export type ServiceRow = Service & { hasImage: boolean };

/* ── Mega title ───────────────────────────────────────────── */

function Star({ className }: { className?: string }) {
  // 8-armed asterisk: lime fill + rust outline so it reads on cream
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={cn("inline-block size-[0.7em] align-[-0.02em]", className)}>
      <path
        d="M44 4h12v31.5l22.3-22.3 8.5 8.5L64.5 44H96v12H64.5l22.3 22.3-8.5 8.5L56 64.5V96H44V64.5L21.7 86.8l-8.5-8.5L35.5 56H4V44h31.5L13.2 21.7l8.5-8.5L44 35.5z"
        className="fill-lime stroke-rust"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Giant title that runs off the right edge and drifts left ~8vw while the section scrolls through */
export function MegaTitle({ id, text, className }: { id: string; text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-8vw"]);
  return (
    // no overflow-hidden here: the full-bleed wrapper in Services.tsx clips at the viewport edges,
    // so the leftward drift can use the left margin instead of cutting off the first letter
    <div ref={ref}>
      <motion.h2
        id={id}
        className={className}
        style={{ x: reduce ? 0 : x }}
        initial={{ opacity: 0 }}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.8, ease }}
      >
        {text} <Star />
        <span aria-hidden> {text} <Star /></span>
      </motion.h2>
    </div>
  );
}

/* ── Accordion rows ───────────────────────────────────────── */

function Fallback({ s, index, className }: { s: ServiceRow; index: number; className?: string }) {
  const Icon = icons[s.icon];
  return (
    <span role="img" aria-label={s.imageAlt} className={cn("grid size-full place-items-center text-rust", fallbackBg[index % 3], className)}>
      <Icon aria-hidden className="size-1/3 max-h-16 max-w-16" strokeWidth={1.5} />
    </span>
  );
}

function Row({ s, index, animateOpen }: { s: ServiceRow; index: number; animateOpen: boolean }) {
  return (
    <AccordionPrimitive.Item value={s.slug} className="relative">
      {/* divider draws left → right */}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-rust/30"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease, delay: index * 0.06 } } }}
      />
      <AccordionPrimitive.Header className="m-0">
        <AccordionPrimitive.Trigger className="group/trigger flex h-[88px] w-full cursor-pointer items-center justify-between gap-6 rounded-sm text-left focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:outline-none md:h-[104px]">
          <span className="font-heading text-[clamp(1.6rem,3.4vw,2.75rem)] leading-[1.1] font-normal tracking-[-0.02em] text-rust transition-transform duration-300 ease-out md:group-hover/trigger:translate-x-2 motion-reduce:md:group-hover/trigger:translate-x-0">
            {s.title}
          </span>
          {/* desktop thumbnail, fades out while the row is open */}
          <span
            aria-hidden
            className="relative hidden h-[72px] w-[140px] shrink-0 overflow-hidden rounded-xl transition-[opacity,scale,rotate] duration-300 ease-out group-hover/trigger:scale-105 group-hover/trigger:-rotate-2 group-data-[panel-open]/trigger:opacity-0 motion-reduce:group-hover/trigger:scale-100 motion-reduce:group-hover/trigger:rotate-0 md:block"
          >
            {s.hasImage ? (
              <Image src={s.image} alt="" fill sizes="140px" className="object-cover object-center" />
            ) : (
              <Fallback s={s} index={index} />
            )}
          </span>
          {/* mobile toggle: + rotates to × */}
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full bg-lime text-rust transition-transform duration-300 group-data-[panel-open]/trigger:rotate-45 md:hidden"
          >
            <Plus className="size-4" strokeWidth={1.5} />
          </span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
        <div className="grid gap-4 pb-8 md:grid-cols-12 md:items-center md:gap-12 md:pb-12">
          <motion.div
            className="relative aspect-[16/10] overflow-hidden rounded-[20px] md:order-2 md:col-span-7 md:rounded-[24px]"
            initial={animateOpen ? { opacity: 0, scale: 0.96 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease }}
          >
            {s.hasImage ? (
              <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            ) : (
              <Fallback s={s} index={index} />
            )}
          </motion.div>
          <div className="md:order-1 md:col-span-5">
            <p className="max-w-[40ch] text-[15px] leading-[1.65] text-ink/80">{s.short}</p>
            <BookForLink
              problem={s.problem}
              label={`Book an appointment for ${s.title}`}
              className="group/link mt-6 inline-flex h-11 items-center gap-1.5 text-sm font-medium text-rust"
            >
              <span className="underline-offset-4 group-hover/link:underline">Book for this</span>
              <ArrowRight
                aria-hidden
                strokeWidth={1.5}
                className="size-4 transition-transform duration-200 ease-out group-hover/link:translate-x-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0 motion-reduce:group-focus-visible/link:translate-x-0"
              />
            </BookForLink>
          </div>
        </div>
      </AccordionPrimitive.Panel>
    </AccordionPrimitive.Item>
  );
}

/** Rows that fade up 24px as their group reveals (stagger 0.08s) */
function RowGroup({ rows, offset, animateOpen, shown }: { rows: ServiceRow[]; offset: number; animateOpen: boolean; shown: boolean }) {
  return (
    <motion.div
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {rows.map((s, i) => (
        <motion.div
          key={s.slug}
          id={`services-${s.slug}`}
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
        >
          <Row s={s} index={offset + i} animateOpen={animateOpen} />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ── List + curve + See All ───────────────────────────────── */

export function ServicesList({ rows, visible }: { rows: ServiceRow[]; visible: number }) {
  const [open, setOpen] = useState<string[]>(rows.length ? [rows[0].slug] : []);
  const [showAll, setShowAll] = useState(false);
  // the first row is open from the server render: only animate images opened by the user
  const [touched, setTouched] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const listShown = useReveal(listRef);
  const curveShown = useReveal(curveRef);
  const reduce = useReducedMotion();

  const first = rows.slice(0, visible);
  const more = rows.slice(visible);

  // footer "Treatments" links: #services-<slug> opens that row (revealing hidden rows first) and scrolls to it
  useEffect(() => {
    const openFromHash = () => {
      const slug = decodeURIComponent(window.location.hash).match(/^#services-(.+)$/)?.[1];
      const index = rows.findIndex((r) => r.slug === slug);
      if (!slug || index < 0) return;
      setTouched(true);
      setOpen([slug]);
      if (index >= visible) setShowAll(true);
      const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // wait for hidden rows to render, then scroll the row into view
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          document.getElementById(`services-${slug}`)?.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });
        }),
      );
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [rows, visible]);

  const toggleAll = () => {
    const next = !showAll;
    setShowAll(next);
    if (next) {
      // wait for the rows to render, then bring the first new one into view
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          document.getElementById(`services-${more[0]?.slug}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        }),
      );
    }
  };

  return (
    <>
      <div ref={listRef} className="mx-auto max-w-[1000px] px-6 lg:px-0">
        <Accordion
          value={open}
          onValueChange={(v) => {
            setTouched(true);
            setOpen(v as string[]);
          }}
        >
          <RowGroup rows={first} offset={0} animateOpen={touched} shown={listShown} />
          {more.length > 0 && (
            <div id="services-more" hidden={!showAll}>
              {showAll &&
                more.map((s, i) => (
                  <motion.div
                    key={s.slug}
                    id={`services-${s.slug}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: i * 0.08 }}
                  >
                    {/* divider is already drawn for newly revealed rows */}
                    <motion.div initial="show" animate="show">
                      <Row s={s} index={visible + i} animateOpen />
                    </motion.div>
                  </motion.div>
                ))}
            </div>
          )}
        </Accordion>
        {/* closing line under the last visible row */}
        <motion.span
          aria-hidden
          className="block h-px origin-left bg-rust/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: listShown ? 1 : 0 }}
          transition={{ duration: 0.8, ease, delay: Math.min(rows.length, visible) * 0.06 }}
        />
      </div>

      <div ref={curveRef} className="relative mt-24">
        <CurveDivider top="cream" bottom="lavender" className="-mb-px" />
        {more.length > 0 && (
          <motion.button
            type="button"
            onClick={toggleAll}
            aria-expanded={showAll}
            aria-controls="services-more"
            className="absolute bottom-0 left-1/2 z-20 grid size-24 -translate-x-1/2 translate-y-1/2 cursor-pointer place-items-center rounded-full bg-lime text-[13px] font-medium text-rust ring-8 ring-lime/30 transition-[scale,box-shadow] duration-200 ease-out hover:scale-[1.06] hover:ring-[12px] focus-visible:ring-rust focus-visible:outline-none md:size-28 motion-reduce:hover:scale-100"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={curveShown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            {showAll ? "− Show Less" : "+ See All"}
          </motion.button>
        )}
      </div>
    </>
  );
}
