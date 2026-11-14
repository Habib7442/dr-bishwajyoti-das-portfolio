import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { chamber, directionsUrl, footer, fullAddress, quickFacts, services, site, type SocialKey } from "@/data/site";
import { reviewsState } from "@/data/reviews";
import { bookingHref, isExternal, isTodo, telHref, whatsappUrl } from "@/lib/site-helpers";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { Facebook, Google, Instagram, YouTube } from "@/components/icons/Social";
import { CurrentYear } from "@/components/ui/current-year";
import { Monogram } from "@/components/ui/monogram";
import { Reveal } from "@/components/ui/reveal";

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;
const NewTabHint = () => <span className="sr-only"> (opens in a new tab)</span>;

const link = "underline-offset-4 hover:underline focus-visible:outline-rust";
const heading = "text-[13px] font-semibold text-rust";

const socialMeta: Record<SocialKey, { label: string; Icon: typeof Facebook }> = {
  facebook: { label: "Facebook", Icon: Facebook },
  instagram: { label: "Instagram", Icon: Instagram },
  youtube: { label: "YouTube", Icon: YouTube },
  google: { label: "Google reviews and listing", Icon: Google },
};

/**
 * Lime footer (continues the CTA band).
 * `base` prefixes the in-page anchors: "" on the home page, "/" on other pages (/privacy).
 */
export function Footer({ base = "" }: { base?: "" | "/" }) {
  const menu = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Chamber", href: "#contact" },
    ...(reviewsState() === "hidden" ? [] : [{ label: "Reviews", href: "#reviews" }]),
    { label: "FAQ", href: "#faq" },
  ];
  const treatments = services.slice(0, 5);
  const social = (Object.entries(footer.social) as [SocialKey, string][]).filter(([, v]) => !isTodo(v));
  const wa = whatsappUrl(site.whatsappMessage);
  const bookExt = isExternal(bookingHref);

  return (
    <footer id="site-footer" className="bg-lime pb-12 text-rust">
      <Reveal className="mx-auto max-w-[1200px] px-6 lg:px-16">
        <div className="border-t border-rust/20 pt-16">
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-4">
              <a href={`${base}#home`} className="inline-flex items-center gap-3 rounded-[12px] focus-visible:outline-rust">
                <Monogram />
                <span className="font-heading text-[22px] leading-tight font-semibold tracking-[-0.02em]">{site.name}</span>
              </a>
              <p className="mt-4 max-w-[32ch] text-sm leading-[1.6]">{footer.tagline}</p>
              <ul className="mt-6 flex flex-wrap gap-3">
                <li>
                  <a
                    href={bookingHref}
                    {...(bookExt ? newTab : {})}
                    className="inline-flex h-8 items-center rounded-full border border-rust/30 px-4 text-[12px] font-medium transition-colors hover:bg-rust/5 focus-visible:outline-rust"
                  >
                    {wa ? "Book on WhatsApp" : "Book online"}
                    {bookExt && <NewTabHint />}
                  </a>
                </li>
                {wa && (
                  <li>
                    <a
                      href={site.onlineBooking}
                      {...newTab}
                      className="inline-flex h-8 items-center rounded-full border border-rust/30 px-4 text-[12px] font-medium transition-colors hover:bg-rust/5 focus-visible:outline-rust"
                    >
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
              <ul className="mt-4 grid gap-3 text-sm">
                {menu.map((l) => (
                  <li key={l.href}>
                    <a href={`${base}${l.href}`} className={link}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Treatments: #services-<slug> opens that row in the Services accordion */}
            <nav aria-labelledby="footer-treatments" className="col-span-1 lg:col-span-2">
              <h3 id="footer-treatments" className={heading}>
                Treatments
              </h3>
              <ul className="mt-4 grid gap-3 text-sm">
                {treatments.map((s) => (
                  <li key={s.slug}>
                    <a href={`${base}#services-${s.slug}`} className={link}>
                      {s.shortTitle ?? s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Visit */}
            <div className="col-span-2 lg:col-span-4">
              <h3 className={heading}>Visit</h3>
              <address className="mt-4 grid gap-3 text-sm leading-[1.6] not-italic">
                <p>
                  <span className="font-medium">{chamber.hospital}</span>
                  <br />
                  {fullAddress.replace(`${chamber.hospital}, `, "")}
                </p>
                <p>
                  {quickFacts.hours}
                  {footer.closedNote && (
                    <>
                      <br />
                      {footer.closedNote}
                    </>
                  )}
                </p>
                {(telHref || wa) && (
                  <ul className="grid gap-3">
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
                  <a href={directionsUrl} {...newTab} className={`group inline-flex items-center gap-1 font-medium ${link}`}>
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
                            className="grid size-10 place-items-center rounded-full border border-rust/30 transition-colors hover:bg-rust/5 focus-visible:outline-rust"
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

          {/* Bottom row */}
          <div className="mt-16 flex flex-col gap-3 border-t border-rust/20 pt-6 text-[12px] leading-[1.5] md:flex-row md:items-start md:justify-between md:gap-6">
            <p className="shrink-0">
              © <CurrentYear /> {site.name}. All rights reserved.
            </p>
            <p className="md:max-w-[52ch] md:text-center">{footer.disclaimer}</p>
            <p className="flex shrink-0 gap-3">
              <Link href="/privacy" className={link}>
                Privacy Policy
              </Link>
              <span aria-hidden>·</span>
              <a href={footer.credit.href} {...newTab} className={link}>
                {footer.credit.label}
                <NewTabHint />
              </a>
            </p>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
