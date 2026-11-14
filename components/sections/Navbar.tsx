"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ease } from "@/lib/motion";
import { bookNow } from "@/lib/scroll-to-booking";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  links: { label: string; href: string }[];
  /** prefix for in-page anchors: "" on the home page, "/" on other pages */
  base?: "" | "/";
};

/** background appears as soon as the page moves; height shrinks after 80px */
const BG_THRESHOLD = 8;
const SHRINK_THRESHOLD = 80;

const bookNowClass =
  "inline-flex h-10 items-center rounded-full bg-rust px-5 text-[13px] font-medium text-white transition duration-200 ease-out hover:-translate-y-px hover:bg-rust-dark motion-reduce:hover:translate-y-0";


export function Navbar({ name, links, base = "" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > BG_THRESHOLD);
      setCompact(window.scrollY > SHRINK_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
        scrolled ? "border-rust/10 bg-cream/90 backdrop-blur-md backdrop-saturate-150" : "border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-[1200px] items-center justify-between px-6 transition-[height] duration-300 ease-out lg:px-16",
          compact ? "h-16" : "h-20",
        )}
      >
        <a href={`${base}#home`} className="font-heading text-xl font-semibold tracking-[-0.03em] text-rust md:text-2xl">
          {name}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={`${base}${l.href}`}
                className="text-[11px] font-medium tracking-[0.08em] text-rust uppercase decoration-lime decoration-2 underline-offset-8 transition-colors hover:text-rust-dark hover:underline"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            {base ? (
              // other pages (/privacy): plain link to the home page form
              <Link href="/#home" className={bookNowClass}>
                Book Now
              </Link>
            ) : (
              <button type="button" onClick={() => bookNow()} className={bookNowClass}>
                Book Now
              </button>
            )}
          </li>
        </ul>

        <Sheet>
          <SheetTrigger className="-mr-2 grid size-11 place-items-center rounded-full text-rust md:hidden" aria-label="Open menu">
            <Menu className="size-6" strokeWidth={1.5} />
          </SheetTrigger>
          <SheetContent
            side="top"
            showCloseButton={false}
            className="border-none bg-rust px-6 pt-5 pb-10 text-white shadow-none data-[side=top]:h-dvh"
          >
            <div className="flex h-11 items-center justify-between">
              <SheetTitle className="font-heading text-xl font-semibold tracking-[-0.03em] text-white">{name}</SheetTitle>
              <SheetClose
                className="-mr-2 grid size-11 place-items-center rounded-full text-white focus-visible:outline-lime"
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
                  <SheetClose
                    nativeButton={false}
                    render={<a href={`${base}${l.href}`} />}
                    className="block py-2 font-heading text-[40px] leading-tight font-medium tracking-[-0.03em] text-white hover:text-lime focus-visible:outline-lime"
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
