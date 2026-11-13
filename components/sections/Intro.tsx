import { site } from "@/data/site";
import { telHref } from "@/lib/site-helpers";
import { Reveal } from "@/components/ui/reveal";
import { Asterisk, Field } from "@/components/ui/text-bits";

export function Intro() {
  return (
    <section aria-labelledby="intro-title" className="bg-rust text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-20 md:px-8 md:py-32">
        <Reveal>
          <h2 id="intro-title" className="font-display max-w-[16ch] text-[clamp(2.25rem,6vw,5.5rem)] font-medium">
            Expert care for your <Asterisk className="align-[0.1em] text-[0.7em]" /> ear, nose, throat and{" "}
            <span className="text-lime">allergy</span> problems
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 grid gap-10 border-t border-white/25 pt-10 md:mt-16 md:grid-cols-2">
          <p className="max-w-xl text-base leading-relaxed text-white/85">
            Ear, nose and throat problems affect how you hear, breathe, sleep and speak. At the chamber in {site.city},
            every patient gets a careful examination, a plain-language explanation and a treatment plan that starts with
            the simplest effective option.
          </p>
          <div className="md:justify-self-end md:text-right">
            <p className="text-sm font-medium tracking-wide text-lime uppercase">Book Appointment</p>
            {telHref ? (
              <a
                href={telHref}
                className="mt-2 inline-block font-heading text-3xl font-semibold tracking-[-0.03em] underline decoration-lime decoration-2 underline-offset-8 md:text-5xl"
              >
                {site.phone}
              </a>
            ) : (
              <p className="mt-2 font-heading text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
                <Field value={`${site.phone}: phone number`} />
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
