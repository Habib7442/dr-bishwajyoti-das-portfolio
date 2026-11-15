import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Cta } from "@/components/sections/Cta";
import { serviceRows } from "@/components/sections/Services";
import { Fallback } from "@/components/sections/ServicesMotion";
import { ScopeViewPoster } from "@/components/ScopeViewPoster";
import { cameraViews, scopeViewsFor } from "@/data/scopeViews";
import { services } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { bookingPageHref } from "@/lib/scroll-to-booking";

// One static page per service (Cache Components needs at least one param here; the list is never empty).
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return pageMetadata({ title: `${s.title} in Silchar`, description: s.short, path: `/services/${s.slug}` });
}

/** Placeholder detail page (title, image, description, book button); the full design comes later. */
export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const index = services.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const s = serviceRows()[index];

  return (
    <main>
      <article aria-labelledby="service-title" className="bg-base pt-36 pb-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
          <Link href="/services" className="inline-flex h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline">
            <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
            All services
          </Link>
          <div className="mt-6 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h1
                id="service-title"
                className="font-heading text-[clamp(2.5rem,5.5vw,4.25rem)] leading-none font-medium tracking-[-0.03em] text-primary"
              >
                {s.title}
              </h1>
              <p className="mt-6 max-w-[46ch] text-base leading-[1.7] text-ink/80">{s.short}</p>
              <Link
                href={bookingPageHref(s.problem)}
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-[13px] font-medium text-white transition duration-200 ease-out hover:-translate-y-px hover:bg-primary-dark motion-reduce:hover:translate-y-0"
              >
                Book for {s.shortTitle ?? s.title}
              </Link>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] lg:col-span-6">
              {s.hasImage ? (
                <Image src={s.image} alt={s.imageAlt} fill preload sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
              ) : (
                <Fallback s={s} index={index} />
              )}
            </div>
          </div>
          {s.slug === "endoscopy" ? (
            <section aria-labelledby="scope-views-title" className="mt-24">
              <h2
                id="scope-views-title"
                className="font-heading text-[clamp(2rem,4vw,3rem)] leading-none font-medium tracking-[-0.03em] text-primary"
              >
                What the doctor sees
              </h2>
              <div className="mt-12 flex flex-col gap-12">
                {cameraViews.map((v) => (
                  <ScopeViewPoster key={v.slug} view={v} headingLevel="h3" />
                ))}
              </div>
              <Link href="/gallery" className="mt-8 inline-flex h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline">
                See the gallery
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
              </Link>
            </section>
          ) : (
            scopeViewsFor(s.slug).map((v) => (
              <div key={v.slug} className="mt-24">
                <ScopeViewPoster view={v} compact />
              </div>
            ))
          )}
        </div>
      </article>
      <Cta />
    </main>
  );
}
