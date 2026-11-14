import { footer, site } from "@/data/site";
import { bookingHref, isExternal, telHref, whatsappNumber } from "@/lib/site-helpers";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { CtaReveal } from "./CtaMotion";

const pill =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-[13px] font-medium transition duration-200 ease-out hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust motion-reduce:hover:translate-y-0 [&_svg]:size-4";

/** Lime "Book your appointment today" band; the footer continues on the same lime below */
export function Cta() {
  const ext = isExternal(bookingHref);
  return (
    <section id="book" aria-labelledby="cta-title" className="bg-lime pt-24 pb-16 text-center md:pt-36 md:pb-24">
      <CtaReveal id="cta-title" title={footer.ctaTitle} className="mx-auto max-w-[1200px] px-6 lg:px-16">
        <p className="mt-6 text-sm text-rust">{footer.ctaText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={bookingHref}
            {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`${pill} bg-rust text-white hover:bg-rust-dark`}
          >
            <WhatsApp aria-hidden />
            {whatsappNumber ? "Book on WhatsApp" : "Book Online"}
            {ext && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
          {telHref && (
            <a href={telHref} className={`${pill} border border-rust/40 text-rust hover:bg-rust/5`}>
              Call {site.phone}
            </a>
          )}
        </div>
      </CtaReveal>
    </section>
  );
}
