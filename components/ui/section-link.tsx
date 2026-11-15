"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { afterDialogsClose, parseSectionHref, scrollToSection, setPendingSection } from "@/lib/section-scroll";
import { startRouteProgress } from "@/components/ui/route-progress";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & {
  /** "/about" (page), "#contact" or "/#contact" (home section), "/services#ear" (section on another page) */
  href: string;
};

/**
 * next/link that scrolls to sections without putting "#" in the URL.
 * - section on this page: smooth scroll, URL unchanged
 * - section on another page: client-side navigation, then <HashScroll /> scrolls to it
 * - plain page link: normal Link
 * The rendered href keeps the "#…" so the link still works without JavaScript.
 */
export function SectionLink({ href, onClick, ...rest }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { path, id } = parseSectionHref(href);

  return (
    <Link
      href={id ? `${path}#${id}` : path}
      onClick={(e) => {
        onClick?.(e); // e.g. the mobile menu's close handler
        const target = e.currentTarget.target;
        if (!id || (target && target !== "_self") || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        if (path === pathname) {
          afterDialogsClose(() => scrollToSection(id));
        } else {
          setPendingSection(id);
          startRouteProgress(); // the click was prevented, so RouteProgress can't see it as a page change
          router.push(path);
        }
      }}
      {...rest}
    />
  );
}
