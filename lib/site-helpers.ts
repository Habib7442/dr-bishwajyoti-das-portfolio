import { site } from "@/data/site";

export const isTodo = (v: string) => v.trim().toUpperCase().startsWith("TODO");

/** wa.me number: 10-digit Indian mobile → 91XXXXXXXXXX; null while TODO */
export const whatsappNumber = isTodo(site.whatsapp)
  ? null
  : (() => {
      const d = site.whatsapp.replace(/\D/g, "");
      return d.length === 10 ? `91${d}` : d;
    })();

export const whatsappUrl = (message: string) =>
  whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : null;

/** tel: link, or null when the phone number is still a placeholder */
export const telHref = isTodo(site.phone) ? null : `tel:${site.phone.replace(/[^\d+]/g, "")}`;

/** Generic booking link: WhatsApp if set, otherwise the online booking page */
export const bookingHref = whatsappUrl(site.whatsappMessage) ?? site.onlineBooking;

/** Where "Call Now" goes: phone if set, otherwise online booking */
export const callHref = telHref ?? site.onlineBooking;

export const isExternal = (href: string) => href.startsWith("http");
