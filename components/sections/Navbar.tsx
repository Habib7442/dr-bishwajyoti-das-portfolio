"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { SectionLink } from "@/components/ui/section-link";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ease } from "@/lib/motion";
import { bookingPageHref } from "@/lib/scroll-to-booking";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  /** every link is its own page ("/", "/services", "/chamber"…) */
  links: { label: string; href: string }[];
};

/** background appears as soon as the page moves; height shrinks after 80px */
const BG_THRESHOLD = 8;
const SHRINK_THRESHOLD = 80;

const bookNowClass =
  "inline-flex h-10 items-center rounded-full bg-primary px-5 text-[13px] font-medium text-white transition duration-200 ease-out hover:-translate-y-px hover:bg-primary-dark motion-reduce:hover:translate-y-0";

const deskLink = "text-[11px] tracking-[0.08em] uppercase underline-offset-8 transition-colors";
const deskActive = "font-semibold text-primary underline decoration-accent decoration-2";
const deskIdle = "font-medium text-primary/70 hover:text-primary";

const mobileLink = "block py-2 font-heading text-[40px] leading-tight font-medium tracking-[-0.03em] underline-offset-8 focus-visible:outline-accent";
const mobileActive = "text-white underline decoration-accent decoration-2";
const mobileIdle = "text-white/70 hover:text-white";

/** Rendered once in app/layout.tsx, so it stays mounted while pages change */
export function Navbar({ name, links }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isCurrent = (href: string) => href === pathname;
  // home starts on the light hero; every other page gets the solid bar from the top
  // (/chamber and /reviews open on a navy band, where a transparent bar's navy text would vanish)
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > BG_THRESHOLD);
      setCompact(window.scrollY > SHRINK_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu once the new page is showing (also covers back/forward)
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
        solid ? "border-primary/10 bg-base/90 backdrop-blur-md backdrop-saturate-150" : "border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-[1200px] items-center justify-between px-6 transition-[height] duration-300 ease-out lg:px-16",
          compact ? "h-16" : "h-20",
        )}
      >
        <Link href="/" className="font-heading text-xl font-semibold tracking-[-0.03em] text-primary md:text-2xl">
          {name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <SectionLink
                href={l.href}
                aria-current={isCurrent(l.href) ? "page" : undefined}
                className={cn(deskLink, isCurrent(l.href) ? deskActive : deskIdle)}
              >
                {l.label}
              </SectionLink>
            </li>
          ))}
          <li>
            <Link href={bookingPageHref()} aria-current={isCurrent(bookingPageHref()) ? "page" : undefined} className={bookNowClass}>
              Book Now
            </Link>
          </li>
        </ul>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger className="-mr-2 grid size-11 place-items-center rounded-full text-primary md:hidden" aria-label="Open menu">
            <Menu className="size-6" strokeWidth={1.5} />
          </SheetTrigger>
          <SheetContent
            side="top"
            showCloseButton={false}
            className="border-none bg-primary px-6 pt-5 pb-10 text-white shadow-none data-[side=top]:h-dvh"
          >
            <div className="flex h-11 items-center justify-between">
              <SheetTitle className="font-heading text-xl font-semibold tracking-[-0.03em] text-white">{name}</SheetTitle>
              <SheetClose
                className="-mr-2 grid size-11 place-items-center rounded-full text-white focus-visible:outline-accent"
                aria-label="Close menu"
              >
                <X className="size-6" strokeWidth={1.5} />
              </SheetClose>
            </div>
            <ul className="mt-12 flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.06 }}
                >
                  {/* SheetClose: the menu shuts on tap; the pathname check above also closes it after navigation */}
                  <SheetClose
                    nativeButton={false}
                    render={<SectionLink href={l.href} aria-current={isCurrent(l.href) ? "page" : undefined} />}
                    className={cn(mobileLink, isCurrent(l.href) ? mobileActive : mobileIdle)}
                  >
                    {l.label}
                  </SheetClose>
                </motion.li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
