import type { Metadata } from "next";
import { privacy, site } from "@/data/site";
import { telHref, whatsappUrl } from "@/lib/site-helpers";

export const metadata: Metadata = {
  title: privacy.title,
  description: `How ${site.name}'s website handles the details you enter in the booking form.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const wa = whatsappUrl(site.whatsappMessage);

  return (
    <>
      {/* TODO: review with the doctor before launch (content lives in data/site.ts → privacy) */}
      <main className="bg-base pt-36 pb-24">
        <article className="mx-auto max-w-[720px] px-6">
          <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] leading-none font-medium tracking-[-0.03em] text-primary">
            {privacy.title}
          </h1>
          <p className="mt-4 text-xs text-ink/70">Last updated: {privacy.lastUpdated}</p>

          {privacy.sections.map((s) => (
            <section key={s.heading} className="mt-12">
              <h2 className="font-heading text-2xl leading-[1.2] font-medium tracking-[-0.01em] text-primary">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-4 text-[15px] leading-[1.7] text-ink/80">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {(telHref || wa) && (
            <section className="mt-12">
              <h2 className="font-heading text-2xl leading-[1.2] font-medium tracking-[-0.01em] text-primary">Contact</h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-ink/80">
                {privacy.contactLead}{" "}
                {telHref ? (
                  <a href={telHref} className="font-medium text-primary underline underline-offset-4">
                    {site.phone}
                  </a>
                ) : null}
                {telHref && wa ? " or message us on " : wa ? " message us on " : ""}
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">
                    WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                .
              </p>
            </section>
          )}
        </article>
      </main>
    </>
  );
}
