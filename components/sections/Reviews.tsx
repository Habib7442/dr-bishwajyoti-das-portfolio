import { Star } from "lucide-react";
import { displayReviews, isDemoReviews, reviewsState, reviewSummary, type Review } from "@/data/reviews";
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
  Ear: "bg-butter",
  Nose: "bg-lilac",
  Throat: "bg-sky",
  Allergy: "bg-peach",
  General: "bg-cream",
};

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} className={cn("flex gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          strokeWidth={1.5}
          className={cn("size-4", n <= Math.round(rating) ? "fill-rust text-rust" : "fill-rust/20 text-rust/20")}
        />
      ))}
    </span>
  );
}

function ReviewCard({ r, className }: { r: Review; className?: string }) {
  return (
    <CardReveal label={`Review by ${r.name}`} className={cn("relative flex flex-col rounded-[24px] bg-white p-6 md:p-8", className)}>
      <span aria-hidden className="pointer-events-none absolute top-2 right-6 font-serif text-[96px] leading-none text-rust/15">
        “
      </span>
      {r.tag && (
        <span className={cn("inline-flex h-6 items-center self-start rounded-full px-3 text-[11px] font-medium text-ink", tagBg[r.tag])}>
          {r.tag}
        </span>
      )}
      {r.headline && <h3 className="mt-4 font-heading text-[19px] leading-[1.25] font-medium text-rust">{r.headline}</h3>}
      <ReviewQuote text={r.text} className={r.tag || r.headline ? "mt-3" : "mt-0"} />
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-4 border-t border-rust/10 pt-4">
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
            <>via {isDemoReviews() ? "Demo" : r.source}</>
          )}
        </p>
      </div>
    </CardReveal>
  );
}

/** Full version: 2+ real reviews */
function ReviewsFull() {
  const { count, rating, source, listingUrl, writeReviewUrl } = reviewSummary;
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden bg-cream py-24 md:py-36">
      <ReviewsCarousel>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
          <div className="flex items-end justify-between gap-6">
            <RevealHeader>
              <p className="text-xs font-medium tracking-[0.08em] text-ink/60 uppercase">Patient reviews</p>
              <h2
                id="reviews-title"
                className="mt-4 font-heading text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none font-medium tracking-[-0.03em] text-ink"
              >
                {count ? (
                  <>
                    <span className="text-rust">{count}+</span> Reviews
                  </>
                ) : (
                  <>
                    What Patients <AccentWord>Say</AccentWord>
                  </>
                )}
              </h2>
              {rating !== null && (
                <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink/75">
                  <Stars rating={rating} />
                  <span>
                    {rating} on {source}
                  </span>
                  {listingUrl && (
                    <a href={listingUrl} {...ext} className="font-medium text-rust underline-offset-4 hover:underline">
                      See all reviews →
                    </a>
                  )}
                </p>
              )}
            </RevealHeader>
            <ReviewsArrows className="hidden shrink-0 md:flex" />
          </div>

          {isDemoReviews() && (
            <p role="note" className="mt-8 rounded-2xl bg-rust px-4 py-3 text-center text-[13px] font-medium text-white">
              Demo reviews — development preview only, not real patient reviews
            </p>
          )}

          <section aria-roledescription="carousel" aria-label="Patient reviews" className="mt-12">
            {/* bleeds past the container to the right edge of the viewport */}
            <div className="mr-[calc(50%-50vw)]">
              <ReviewsTrack className="flex snap-x snap-mandatory gap-6 overflow-x-auto pr-6 pb-2 [scrollbar-width:none] focus-visible:outline-offset-4 lg:pr-16 [&::-webkit-scrollbar]:hidden">
                {displayReviews().map((r, i) => (
                  <ReviewCard key={`${r.name}-${i}`} r={r} className="w-[85%] shrink-0 snap-start sm:w-[320px] md:w-[360px]" />
                ))}
              </ReviewsTrack>
            </div>
            <ReviewsArrows className="mt-8 flex justify-center md:hidden" />
          </section>

          <div className="mt-12 text-center">
            <p className="text-sm text-ink/70">Visited Dr. Das? Your review helps other patients.</p>
            {writeReviewUrl && (
              <Pill href={writeReviewUrl} variant="rust" className="mt-4">
                Write a review
              </Pill>
            )}
          </div>
        </div>
      </ReviewsCarousel>
    </section>
  );
}

/** Fallback: fewer than 2 real reviews, but a review/listing link exists */
function ReviewsFallback() {
  const { listingUrl, writeReviewUrl } = reviewSummary;
  const single = displayReviews()[0];
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative bg-cream py-24">
      <div className="mx-auto max-w-[640px] px-6 text-center">
        <RevealHeader>
          <h2
            id="reviews-title"
            className="font-heading text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none font-medium tracking-[-0.03em] text-ink"
          >
            Your <AccentWord>feedback</AccentWord> matters
          </h2>
          <p className="mt-4 text-[15px] leading-[1.65] text-ink/75">
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
            <Pill href={writeReviewUrl} variant="rust">
              Write a Google review
            </Pill>
          )}
          {listingUrl && (
            <Pill href={listingUrl} variant="outline-dark">
              See listing
            </Pill>
          )}
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  const state = reviewsState();
  if (state === "full") return <ReviewsFull />;
  if (state === "fallback") return <ReviewsFallback />;
  return null;
}
