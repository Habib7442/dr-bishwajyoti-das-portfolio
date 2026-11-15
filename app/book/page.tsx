import { Clock, IndianRupee, MapPin, Phone } from "lucide-react";
import { BookingCard } from "@/components/sections/BookingCard";
import { Chamber } from "@/components/sections/Chamber";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { pages, quickFacts, site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { telHref, whatsappUrl } from "@/lib/site-helpers";

const page = pages.book;

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/book" });

const facts = [
  { icon: MapPin, text: quickFacts.place },
  { icon: Clock, text: quickFacts.hours },
  { icon: IndianRupee, text: quickFacts.fee },
];

const altLink =
  "inline-flex h-11 items-center gap-2 rounded-full border border-primary/25 px-5 text-[13px] font-medium text-primary transition-colors hover:bg-primary/5";

export default function BookPage() {
  const wa = whatsappUrl(site.whatsappMessage);

  return (
    <>
      <main>
        <section aria-labelledby="book-title" className="bg-base pt-36 pb-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:items-start lg:gap-6 lg:px-16">
            <div className="lg:col-span-6">
              <p className="flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-primary uppercase">
                <span aria-hidden className="h-px w-6 bg-primary" />
                {page.eyebrow}
              </p>
              <h1
                id="book-title"
                className="mt-6 font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-medium tracking-[-0.03em] text-primary"
              >
                {page.heading}
              </h1>
              <p className="mt-6 max-w-[44ch] text-base leading-relaxed text-ink/80">{page.intro}</p>

              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Chamber details">
                {facts.map(({ icon: Icon, text }) => (
                  <li key={text}>
                    <span className="inline-flex h-9 items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 text-[13px] text-primary">
                      <Icon className="size-4" strokeWidth={1.5} aria-hidden />
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 font-heading text-2xl leading-[1.2] font-medium tracking-[-0.01em] text-primary">{page.altHeading}</h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {telHref && (
                  <li>
                    <a href={telHref} className={altLink}>
                      <Phone aria-hidden className="size-4" strokeWidth={1.5} />
                      Call {site.phone}
                    </a>
                  </li>
                )}
                {wa && (
                  <li>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className={altLink}>
                      <WhatsApp aria-hidden className="size-4" />
                      WhatsApp
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                )}
                <li>
                  <a href={site.onlineBooking} target="_blank" rel="noopener noreferrer" className={altLink}>
                    Book online
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </div>

            <div id="book-form" className="mx-auto w-full max-w-[440px] lg:col-span-5 lg:col-start-8 lg:mr-0">
              <BookingCard />
            </div>
          </div>
        </section>
        <Chamber />
        {/* navy Chamber band meets the navy footer here: hairline keeps them apart */}
        <div aria-hidden className="h-px bg-primary">
          <div className="mx-auto h-px max-w-[1200px] bg-white/15" />
        </div>
      </main>
    </>
  );
}
