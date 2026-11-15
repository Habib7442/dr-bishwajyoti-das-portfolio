import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { chamber, footer, directionsUrl, quickFacts, services, site, type SocialKey } from "@/data/site";
import { reviewsState } from "@/data/reviews";
import { bookingHref, isExternal, isTodo, telHref, whatsappUrl } from "@/lib/site-helpers";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { Facebook, Google, Instagram, YouTube } from "@/components/icons/Social";
import { CurrentYear } from "@/components/ui/current-year";
import { Reveal } from "@/components/ui/reveal";
import { SectionLink } from "@/components/ui/section-link";

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;
const NewTabHint = () => <span className="sr-only"> (opens in a new tab)</span>;

const link = "text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-accent";
const heading = "text-[13px] font-semibold text-white";
const pill = "inline-flex h-10 items-center rounded-full px-5 text-[13px] font-medium transition-colors focus-visible:outline-accent";

const socialMeta: Record<SocialKey, { label: string; Icon: typeof Facebook }> = {
  facebook: { label: "Facebook", Icon: Facebook },
  instagram: { label: "Instagram", Icon: Instagram },
  youtube: { label: "YouTube", Icon: YouTube },
  google: { label: "Google reviews and listing", Icon: Google },
};

/** "Meherpur Road, Birbal Bazar," / "Meherpur, Silchar, Assam 788015" (from data/site.ts) */
const addressLines = [
  `${site.address.street},`,
  `${site.address.area}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`,
];

/**
 * Navy footer under the sky CTA band (the colour change separates them, no divider). Rendered once in app/layout.tsx.
 * Links go through <SectionLink> (next/link; "/services#slug" scrolls to that card without "#" in the URL).
 */
export function Footer() {
  // every item is its own page. No "Book": the brand-column buttons cover booking.
  const menu = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Chamber", href: "/chamber" },
    ...(reviewsState() === "hidden" ? [] : [{ label: "Reviews", href: "/reviews" }]),
    { label: "FAQ", href: "/faq" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
  ];
  const treatments = services.slice(0, 5);
  const social = (Object.entries(footer.social) as [SocialKey, string][]).filter(([, v]) => !isTodo(v));
  const wa = whatsappUrl(site.whatsappMessage);
  const bookExt = isExternal(bookingHref);

  return (
    <footer id="site-footer" className="bg-primary pt-16 pb-12 text-sm text-white/70 md:pt-24">
      <Reveal className="mx-auto max-w-[1200px] px-6 lg:px-16">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <SectionLink href="/" className="inline-block rounded-sm focus-visible:outline-accent">
              <span className="block font-heading text-2xl leading-tight font-semibold tracking-[-0.02em] text-white">{site.name}</span>
            </SectionLink>
            <p className="mt-1 text-[13px] text-accent">{site.title}</p>
            <p className="mt-4 max-w-[34ch] leading-[1.6]">{footer.tagline}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              <li>
                <a href={bookingHref} {...(bookExt ? newTab : {})} className={`${pill} bg-accent text-primary hover:bg-accent-dark`}>
                  {wa ? "Book on WhatsApp" : "Book online"}
                  {bookExt && <NewTabHint />}
                </a>
              </li>
              {wa && (
                <li>
                  <a href={site.onlineBooking} {...newTab} className={`${pill} border border-white/30 text-white hover:bg-white/10`}>
                    Book online
                    <NewTabHint />
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Menu */}
          <nav aria-labelledby="footer-menu" className="col-span-1 lg:col-span-2">
            <h3 id="footer-menu" className={heading}>
              Menu
            </h3>
            <ul className="mt-4 grid gap-3">
              {menu.map((l) => (
                <li key={l.href}>
                  <SectionLink href={l.href} className={link}>
                    {l.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Treatments: the matching card on /services */}
          <nav aria-labelledby="footer-treatments" className="col-span-1 lg:col-span-2">
            <h3 id="footer-treatments" className={heading}>
              Treatments
            </h3>
            <ul className="mt-4 grid gap-3">
              {treatments.map((s) => (
                <li key={s.slug}>
                  <SectionLink href={`/services/${s.slug}`} className={link}>
                    {s.shortTitle ?? s.title}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Visit */}
          <div className="col-span-2 lg:col-span-4">
            <h3 className={heading}>Visit</h3>
            <address className="mt-4 grid gap-3 leading-[1.6] not-italic">
              <p>
                <span className="font-medium text-white">{chamber.hospital}</span>
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <p>
                {quickFacts.hours}
                {footer.closedNote && <span className="block">{footer.closedNote}</span>}
              </p>
              {(telHref || wa) && (
                <ul className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:gap-6">
                  {telHref && (
                    <li>
                      <a href={telHref} className={`inline-flex items-center gap-2 ${link}`}>
                        <Phone aria-hidden className="size-4" strokeWidth={1.5} />
                        {site.phone}
                      </a>
                    </li>
                  )}
                  {wa && (
                    <li>
                      <a href={wa} {...newTab} className={`inline-flex items-center gap-2 ${link}`}>
                        <WhatsApp aria-hidden className="size-4" />
                        WhatsApp
                        <NewTabHint />
                      </a>
                    </li>
                  )}
                </ul>
              )}
              <p>
                <a
                  href={directionsUrl}
                  {...newTab}
                  className="group inline-flex items-center gap-1 font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-accent"
                >
                  Get directions
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    strokeWidth={1.5}
                  />
                  <NewTabHint />
                </a>
              </p>
            </address>

            {social.length > 0 && (
              <div className="mt-6">
                <h3 className={heading}>Follow</h3>
                <ul className="mt-3 flex gap-3">
                  {social.map(([key, href]) => {
                    const { label, Icon } = socialMeta[key];
                    return (
                      <li key={key}>
                        <a
                          href={href}
                          {...newTab}
                          aria-label={`${label} (opens in a new tab)`}
                          className="grid size-10 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 focus-visible:outline-accent"
                        >
                          <Icon className="size-[18px]" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer: own line above the bottom row. white/60, not /50: /50 is 4.4:1 on navy, below AA for 12px text */}
        <p className="mt-16 max-w-[70ch] text-[12px] leading-[1.6] text-white/60">{footer.disclaimer}</p>

        {/* Bottom row */}
        <div className="mt-6 flex flex-col gap-3 border-t border-white/15 pt-6 text-[12px] leading-[1.5] text-white/60 md:flex-row md:items-center md:justify-between md:gap-6">
          <p>
            © <CurrentYear /> {site.name}. All rights reserved.
          </p>
          <p className="flex gap-3">
            <Link href="/privacy" className="underline-offset-4 hover:text-white hover:underline focus-visible:outline-accent">
              Privacy Policy
            </Link>
            <span aria-hidden>·</span>
            <a
              href={footer.credit.href}
              {...newTab}
              className="underline-offset-4 hover:text-white hover:underline focus-visible:outline-accent"
            >
              {footer.credit.label}
              <NewTabHint />
            </a>
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
