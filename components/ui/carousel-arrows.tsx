"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCarousel } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

/** Accent prev/next buttons for a shadcn Carousel (placed anywhere inside <Carousel>) */
export function CarouselArrows({ className, label }: { className?: string; label: string }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  const btn =
    "grid size-14 place-items-center rounded-full bg-accent text-primary transition-all hover:scale-105 disabled:scale-100 disabled:opacity-40 [&_svg]:size-5";
  return (
    <div className={cn("flex gap-3", className)}>
      <button type="button" className={btn} onClick={scrollPrev} disabled={!canScrollPrev} aria-label={`Previous ${label}`}>
        <ArrowLeft />
      </button>
      <button type="button" className={btn} onClick={scrollNext} disabled={!canScrollNext} aria-label={`Next ${label}`}>
        <ArrowRight />
      </button>
    </div>
  );
}
