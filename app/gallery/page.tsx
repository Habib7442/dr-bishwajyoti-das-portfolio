import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Cta } from "@/components/sections/Cta";
import { ScopePhoto } from "@/components/ScopePhoto";
import { scopeViews } from "@/data/scopeViews";
import { pages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

const page = pages.gallery;

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/gallery" });

/** /gallery: every scope photo as a card; each opens its own poster page (/gallery/[slug]). */
export default function GalleryPage() {
  return (
    <main>
      <section aria-labelledby="gallery-title" className="bg-base pt-36 pb-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-primary uppercase">
            <span aria-hidden className="h-px w-6 bg-primary" />
            {page.eyebrow}
          </p>
          <h1
            id="gallery-title"
            className="mt-6 font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-medium tracking-[-0.03em] text-primary"
          >
            {page.heading}
          </h1>
          <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.65] text-ink/75">{page.intro}</p>

          <ul className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {scopeViews.map((v, i) => (
              <li key={v.slug}>
                <Link
                  href={`/gallery/${v.slug}`}
                  aria-labelledby={`card-${v.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
                >
                  <div className="flex justify-center bg-primary px-8 py-12">
                    <ScopePhoto
                      view={v}
                      sizes="240px"
                      preload={i < 3}
                      className="size-[240px] transition-[scale] duration-300 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h2 id={`card-${v.slug}`} className="font-heading text-[24px] leading-[1.2] font-medium tracking-[-0.01em] text-primary">
                      {v.title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-[1.65] text-ink/75">{v.text}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[13px] font-medium text-primary underline-offset-4 group-hover:underline">
                      {page.viewLabel}
                      <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Cta />
    </main>
  );
}
