import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ear } from "lucide-react";
import { pages } from "@/data/site";
import { bookingPageHref } from "@/lib/scroll-to-booking";

const page = pages.notFound;

// Next adds noindex to 404 responses itself
export const metadata: Metadata = { title: page.title };

const popular = [
  { label: "Our Services", href: "/services" },
  { label: "About the Doctor", href: "/about" },
  { label: "Chamber, Timings & Fee", href: "/chamber" },
  { label: "Questions patients ask", href: "/faq" },
];

/** Custom 404: rendered inside the root layout, so the navbar and footer stay */
export default function NotFound() {
  return (
    <main className="bg-base pt-36 pb-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:px-16">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-primary uppercase">
            <span aria-hidden className="h-px w-6 bg-primary" />
            {page.eyebrow}
          </p>
          <h1 className="mt-6 font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-medium tracking-[-0.03em] text-primary">
            {page.heading}
          </h1>
          <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.65] text-ink/75">{page.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-[13px] font-medium text-white transition duration-200 ease-out hover:-translate-y-px hover:bg-primary-dark motion-reduce:hover:translate-y-0"
            >
              {page.homeLabel}
            </Link>
            <Link
              href={bookingPageHref()}
              className="inline-flex h-11 items-center justify-center rounded-full border border-primary px-6 text-[13px] font-medium text-primary transition-colors hover:bg-primary/5"
            >
              {page.bookLabel}
            </Link>
          </div>
        </div>

        {/* big "404" with the ear mark: decorative */}
        <div aria-hidden className="relative hidden select-none lg:col-span-5 lg:block">
          <p className="font-heading text-[clamp(8rem,16vw,13rem)] leading-none font-semibold tracking-[-0.06em] text-primary/10">404</p>
          <span className="absolute top-1/2 left-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-accent">
            <Ear className="size-11" strokeWidth={1.5} />
          </span>
        </div>

        <nav aria-labelledby="not-found-links" className="lg:col-span-12">
          <h2 id="not-found-links" className="text-xs font-medium tracking-[0.08em] text-ink/60 uppercase">
            {page.linksLabel}
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex h-full items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 text-[15px] font-medium text-primary transition-colors hover:bg-soft"
                >
                  {l.label}
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
