import { existsSync } from "node:fs";
import { join } from "node:path";
import { services, servicesVisible } from "@/data/site";
import { MegaTitle, ServicesList, type ServiceRow } from "./ServicesMotion";

/** Local /public file present at build time? (icon fallback otherwise) */
const publicFileExists = (src: string) => src.startsWith("/") && existsSync(join(process.cwd(), "public", src));

const intro = "Treatment for common and long-standing ear, nose, throat and allergy problems, for all ages.";

export function Services() {
  const rows: ServiceRow[] = services.map((s) => ({ ...s, hasImage: publicFileExists(s.image) }));

  return (
    // not overflow-hidden: the "See All" button hangs half into the About band below.
    // The mega title's full-bleed wrapper clips its overflow, so the page never scrolls sideways.
    <section id="services" aria-labelledby="services-title" className="relative bg-cream pt-24 md:pt-36">
      <div className="mb-12 md:mb-16">
        {/* full-bleed so the title runs off the viewport edge; left padding = the container's left edge (rem breakpoint so it sorts after lg:pl-16) */}
        <div className="overflow-hidden pl-6 lg:pl-16 min-[75rem]:pl-[calc((100vw-1200px)/2+4rem)]">
          <MegaTitle
            id="services-title"
            text="Our Services"
            className="font-heading text-[clamp(3.5rem,11vw,8rem)] leading-[0.9] font-semibold tracking-[-0.04em] whitespace-nowrap text-rust"
          />
        </div>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
          <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.65] text-ink/75">{intro}</p>
        </div>
      </div>

      <ServicesList rows={rows} visible={servicesVisible} />
    </section>
  );
}
