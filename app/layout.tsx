import { Suspense } from "react";
import { Bricolage_Grotesque, Inter, Instrument_Serif } from "next/font/google";
import { FloatingWhatsApp } from "@/components/sections/FloatingWhatsApp";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { HashScroll } from "@/components/ui/hash-scroll";
import { MotionProvider } from "@/components/ui/motion-provider";
import { RouteProgress } from "@/components/ui/route-progress";
import { reviewsState } from "@/data/reviews";
import { nav, site } from "@/data/site";
import { jsonLdString, siteMetadata, siteViewport } from "@/lib/seo";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument", display: "swap" });

// SEO lives in lib/seo.ts
export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  // no real reviews and no review/listing links → no /reviews page, so drop its nav link too
  const links = reviewsState() === "hidden" ? nav.filter((l) => l.href !== "/reviews") : nav;

  return (
    // data-scroll-behavior="smooth": html has scroll-smooth, so Next must switch it off while it scrolls a new page
    // to the top. Without it (Next 16 default) the route-change scroll animates and lands on the footer.
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={cn("antialiased", inter.variable, bricolage.variable, instrument.variable)}
    >
      <body className="min-h-full bg-base font-sans text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString() }} />
        <MotionProvider>
          {/* useSearchParams needs a Suspense boundary to prerender (cacheComponents) */}
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          {/* navbar + footer stay mounted across pages; only {children} swaps (and shows loading.tsx) */}
          <Navbar name={site.name} links={links} />
          {children}
          <Footer />
          <FloatingWhatsApp />
          <HashScroll />
        </MotionProvider>
      </body>
    </html>
  );
}
