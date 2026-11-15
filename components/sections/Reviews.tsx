import { Star } from "lucide-react";
import { reviews, reviewsState, reviewSummary, type Review } from "@/data/reviews";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/pill";
import {
  AccentWord,
  CardReveal,
  RevealHeader,
  ReviewQuote,
  ReviewsArrows,
  ReviewsCarousel,
  ReviewsTrack,
} from "./ReviewsMotion";

const tagBg: Record<NonNullable<Review["tag"]>, string> = {
  Ear: "bg-tint-2",
  Nose: "bg-soft",
  Throat: "bg-tint-3",
  Allergy: "bg-tint-1",
  General: "bg-base",
};

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Navy stars on white cards; `onDark` = accent stars for the summary line on the navy band */
function Stars({ rating, onDark = false, className }: { rating: number; onDark?: boolean; className?: string }) {
  const on = onDark ? "fill-accent text-accent" : "fill-primary text-primary";
  const off = onDark ? "fill-white/20 text-white/20" : "fill-primary/20 text-primary/20";
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} className={cn("flex gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} aria-hidden strokeWidth={1.5} className={cn("size-4", n <= Math.round(rating) ? on : off)} />
      ))}
    </span>
  );
}

function ReviewCard({ r, className }: { r: Review; className?: string }) {
  return (
    <CardReveal label={`Review by ${r.name}`} className={cn("relative flex flex-col rounded-[24px] bg-white p-6 md:p-8", className)}>
      <span aria-hidden className="pointer-events-none absolute top-2 right-6 font-serif text-[96px] leading-none text-primary/15">
        “
      </span>
      {r.tag && (
        <span className={cn("inline-flex h-6 items-center self-start rounded-full px-3 text-[11px] font-medium text-ink", tagBg[r.tag])}>
          {r.tag}
        </span>
      )}
      {r.headline && <h3 className="mt-4 font-heading text-[19px] leading-[1.25] font-medium text-primary">{r.headline}</h3>}
      <ReviewQuote text={r.text} className={r.tag || r.headline ? "mt-3" : "mt-0"} />
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-4 border-t border-primary/10 pt-4">
          <div>
            <p className="text-[13px] font-medium text-ink">{r.name}</p>
            {r.date && <p className="text-xs text-ink/50">{r.date}</p>}
          </div>
          <Stars rating={r.rating} />
        </div>
        <p className="mt-3 text-[11px] text-ink/50">
          {r.sourceUrl ? (
            <a href={r.sourceUrl} {...ext} className="hover:underline">
              via {r.source}
            </a>
          ) : (
            <>via {r.source}</>
          )}
        </p>
      </div>
    </CardReveal>
  );
}

const titleClass = "font-heading text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none font-medium tracking-[-0.03em] text-white";
const darkLink = "font-medium text-white underline-offset-4 hover:underline focus-visible:outline-accent";

type HeadingProps = { headingAs: "h1" | "h2" };

/** Full version: 2+ real reviews. Navy band; white cards. */
function ReviewsFull({ headingAs: Heading }: HeadingProps) {
  const { count, rating, source, listingUrl, writeReviewUrl } = reviewSummary;
  const pad = Heading === "h1" ? "pt-36 pb-24 md:pb-36" : "py-24 md:py-36";
  return (
    <section id="reviews" aria-labelledby="reviews-title" className={cn("relative overflow-hidden bg-primary", pad)}>
      <ReviewsCarousel>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
          <div className="flex items-end justify-between gap-6">
            <RevealHeader>
              <p className="text-xs font-medium tracking-[0.08em] text-white/70 uppercase">Patient reviews</p>
              <Heading id="reviews-title" className={cn("mt-4", titleClass)}>
                {count ? (
                  <>
                    <AccentWord onDark>{count}+</AccentWord> Reviews
                  </>
                ) : (
                  <>
                    What Patients <AccentWord onDark>Say</AccentWord>
                  </>
                )}
              </Heading>
              {rating !== null && (
                <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/80">
                  <Stars rating={rating} onDark />
                  <span>
                    {rating} on {source}
                  </span>
                  {listingUrl && (
                    <a href={listingUrl} {...ext} className={darkLink}>
                      See all reviews →
                    </a>
                  )}
                </p>
              )}
            </RevealHeader>
            <ReviewsArrows className="hidden shrink-0 md:flex" />
          </div>

          <section aria-roledescription="carousel" aria-label="Patient reviews" className="mt-12">
            {/* bleeds past the container to the right edge of the viewport */}
            <div className="mr-[calc(50%-50vw)]">
              <ReviewsTrack className="flex snap-x snap-mandatory gap-6 overflow-x-auto pr-6 pb-2 [scrollbar-width:none] focus-visible:outline-accent focus-visible:outline-offset-4 lg:pr-16 [&::-webkit-scrollbar]:hidden">
                {reviews.map((r, i) => (
                  <ReviewCard key={`${r.name}-${i}`} r={r} className="w-[85%] shrink-0 snap-start sm:w-[320px] md:w-[360px]" />
                ))}
              </ReviewsTrack>
            </div>
            <ReviewsArrows className="mt-8 flex justify-center md:hidden" />
          </section>

          <div className="mt-12 text-center">
            <p className="text-sm text-white/80">Visited Dr. Das? Your review helps other patients.</p>
            {writeReviewUrl && (
              <Pill href={writeReviewUrl} variant="accent" className="mt-4">
                Write a review
              </Pill>
            )}
          </div>
        </div>
      </ReviewsCarousel>
    </section>
  );
}

/** Fallback: fewer than 2 real reviews, but a review/listing link exists. Same navy styling. */
function ReviewsFallback({ headingAs: Heading }: HeadingProps) {
  const { listingUrl, writeReviewUrl } = reviewSummary;
  const single = reviews[0];
  return (
    <section id="reviews" aria-labelledby="reviews-title" className={cn("relative bg-primary", Heading === "h1" ? "pt-36 pb-24" : "py-24")}>
      <div className="mx-auto max-w-[640px] px-6 text-center">
        <RevealHeader>
          <Heading id="reviews-title" className={titleClass}>
            Your <AccentWord onDark>feedback</AccentWord> matters
          </Heading>
          <p className="mt-4 text-[15px] leading-[1.65] text-white/80">
            Visited Dr. Biswajyoti Das? Share your experience to help other patients find the right care.
          </p>
        </RevealHeader>
        {single && (
          <RevealHeader className="mx-auto mt-12 max-w-[420px] text-left">
            <ReviewCard r={single} />
          </RevealHeader>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {writeReviewUrl && (
            <Pill href={writeReviewUrl} variant="accent">
              Write a Google review
            </Pill>
          )}
          {listingUrl && (
            <Pill href={listingUrl} variant="outline-light">
              See listing
            </Pill>
          )}
        </div>
      </div>
    </section>
  );
}

/** `headingAs="h1"` on /reviews, where it is the whole page */
export function Reviews({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const state = reviewsState();
  if (state === "full") return <ReviewsFull headingAs={headingAs} />;
  if (state === "fallback") return <ReviewsFallback headingAs={headingAs} />;
  return null;
}
