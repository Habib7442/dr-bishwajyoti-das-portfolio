import { Bricolage_Grotesque, Inter, Instrument_Serif } from "next/font/google";
import { MotionProvider } from "@/components/ui/motion-provider";
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
  return (
    <html lang="en-IN" className={cn("antialiased", inter.variable, bricolage.variable, instrument.variable)}>
      <body className="min-h-full bg-cream font-sans text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString() }} />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
