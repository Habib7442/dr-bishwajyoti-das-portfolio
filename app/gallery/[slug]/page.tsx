import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Cta } from "@/components/sections/Cta";
import { ScopeViewPoster } from "@/components/ScopeViewPoster";
import { scopeViews } from "@/data/scopeViews";
import { pages, services } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

const page = pages.gallery;

// One static page per photo (Cache Components needs at least one param here; the list is never empty).
export function generateStaticParams() {
  return scopeViews.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gallery/[slug]">) {
  const { slug } = await params;
  const v = scopeViews.find((x) => x.slug === slug);
  if (!v) return {};
  return pageMetadata({ title: `${v.title}: What the Doctor Sees`, description: v.text, path: `/gallery/${v.slug}` });
}

/** /gallery/[slug]: one scope photo as the full poster (its title is the page h1). */
export default async function GalleryItemPage({ params }: PageProps<"/gallery/[slug]">) {
  const { slug } = await params;
  const v = scopeViews.find((x) => x.slug === slug);
  if (!v) notFound();
  const related = services.filter((s) => v.services.includes(s.slug) || s.slug === "endoscopy");

  return (
    <main>
      <article className="bg-base pt-36 pb-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
          <Link href="/gallery" className="inline-flex h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline">
            <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
            {page.backLabel}
          </Link>
          <div className="mt-6">
            <ScopeViewPoster view={v} headingLevel="h1" preload />
          </div>
          {related.length > 0 && (
            <nav aria-labelledby="related-title" className="mt-12">
              <h2 id="related-title" className="text-xs font-medium tracking-[0.08em] text-ink/60 uppercase">
                {page.relatedLabel}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {related.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-primary/20 px-6 text-[13px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      {s.title}
                      <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </article>
      <Cta />
    </main>
  );
}
