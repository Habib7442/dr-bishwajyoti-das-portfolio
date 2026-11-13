import { cn } from "@/lib/utils";

/**
 * Endless left-scrolling row of words with a ✳ between them (decorative, aria-hidden).
 * The words are rendered in two identical halves; the track slides -50% so the loop is seamless.
 * Pauses on hover; static with reduced motion.
 */
export function Marquee({ items, className, glyphClassName }: { items: string[]; className?: string; glyphClassName?: string }) {
  // repeat inside each half so one half is always wider than the widest ribbon
  const half = [...items, ...items];
  // pr-8 keeps the seam between the two halves the same as the gap-8 inside them
  const renderHalf = (key: string) => (
    <div key={key} className="flex shrink-0 items-center gap-8 pr-8">
      {half.flatMap((word, i) => [
        <span key={`${key}-w${i}`}>{word}</span>,
        <span key={`${key}-g${i}`} className={glyphClassName}>
          ✳
        </span>,
      ])}
    </div>
  );
  return (
    <div aria-hidden className={cn("overflow-hidden", className)}>
      <div className="flex w-max animate-marquee whitespace-nowrap hover:[animation-play-state:paused] motion-reduce:animate-none">
        {renderHalf("a")}
        {renderHalf("b")}
      </div>
    </div>
  );
}
