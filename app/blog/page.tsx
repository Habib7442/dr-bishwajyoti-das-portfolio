import { Baby, Clock, Ear, Flower2, Mic, Wind, type LucideIcon } from "lucide-react";
import { Cta } from "@/components/sections/Cta";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { pages, site, upcomingPosts, type BlogTopic } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site-helpers";

const page = pages.blog;

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/blog" });

const topicIcon: Record<BlogTopic, LucideIcon> = { Ear, Nose: Wind, Throat: Mic, Allergy: Flower2, Children: Baby };
// cool tints only (literal classes so Tailwind generates them)
const topicBg: Record<BlogTopic, string> = {
  Ear: "bg-tint-1",
  Nose: "bg-section",
  Throat: "bg-tint-3",
  Allergy: "bg-soft",
  Children: "bg-tint-1",
};

/** /blog: upcoming articles, each marked "Coming soon" (no article pages yet, so the cards aren't links) */
export default function BlogPage() {
  const ask = whatsappUrl(page.askMessage) ?? site.onlineBooking;

  return (
    <main>
      <section aria-labelledby="blog-title" className="bg-base pt-36 pb-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-primary uppercase">
            <span aria-hidden className="h-px w-6 bg-primary" />
            {page.eyebrow}
          </p>
          <h1 id="blog-title" className="mt-6 font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-medium tracking-[-0.03em] text-primary">
            {page.heading}
          </h1>
          <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.65] text-ink/75">{page.intro}</p>

          <ul className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {upcomingPosts.map((p) => {
              const Icon = topicIcon[p.topic];
              return (
                <li key={p.slug}>
                  <article aria-labelledby={`post-${p.slug}`} className="flex h-full flex-col rounded-[28px] bg-white p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <span className={`grid size-12 place-items-center rounded-2xl text-primary ${topicBg[p.topic]}`}>
                        <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                      </span>
                      <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-primary/15 px-3 text-[11px] font-medium tracking-[0.04em] text-primary/70 uppercase">
                        <Clock aria-hidden className="size-3.5" strokeWidth={1.5} />
                        {page.comingSoon}
                      </span>
                    </div>
                    <p className="mt-6 text-xs font-medium tracking-[0.08em] text-ink/60 uppercase">{p.topic}</p>
                    <h2 id={`post-${p.slug}`} className="mt-2 font-heading text-[22px] leading-[1.2] font-medium tracking-[-0.01em] text-primary">
                      {p.title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-[1.65] text-ink/75">{p.excerpt}</p>
                  </article>
                </li>
              );
            })}
          </ul>

          {/* question prompt: the only action on the page while articles are coming */}
          <div className="mt-12 flex flex-col gap-6 rounded-[28px] bg-primary p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="font-heading text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] font-medium tracking-[-0.01em] text-white">{page.askTitle}</h2>
              <p className="mt-2 max-w-[48ch] text-[15px] leading-[1.65] text-white/75">{page.askText}</p>
            </div>
            <a
              href={ask}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-accent px-6 text-[13px] font-medium text-primary transition-colors hover:bg-accent-dark focus-visible:outline-accent md:self-auto [&_svg]:size-4"
            >
              <WhatsApp aria-hidden />
              {page.askLabel}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
      <Cta />
    </main>
  );
}
