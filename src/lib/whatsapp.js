/**
 * WhatsApp hand-off for every form on the site.
 * Change the number in ONE place: international format, digits only (91 = India + 10-digit mobile).
 */
export const WHATSAPP_NUMBER = "917736960988";

const BRAND = "Serenara Resort & Spa";

const parseISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtDate = (s) => (s ? parseISO(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "-");
const nightsBetween = (a, b) => (a && b ? Math.round((parseISO(b) - parseISO(a)) / 864e5) : 0);
const plural = (n, w) => `${n} ${w}${+n === 1 ? "" : "s"}`;

export const whatsappUrl = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/**
 * Opens WhatsApp (app on phones, WhatsApp Web on desktop) with the message pre-filled.
 * Must be called synchronously from a click/submit handler so popup blockers allow it;
 * if the new tab is blocked it falls back to navigating the current tab. Returns the URL.
 */
export function openWhatsApp(text) {
  const url = whatsappUrl(text);
  const win = window.open(url, "_blank");
  if (win) { try { win.opener = null; } catch { /* cross-origin: ignore */ } }
  else window.location.href = url;
  return url;
}

/** Full enquiry from the "Plan your stay" form. */
export function enquiryMessage(v) {
  const n = nightsBetween(v.checkin, v.checkout);
  return [
    `Hello ${BRAND}! I'd like to enquire about a stay.`,
    "",
    `*Name:* ${v.name.trim()}`,
    `*Phone:* ${v.phone.trim()}`,
    `*Email:* ${v.email.trim()}`,
    `*Villa type:* ${v.room}`,
    `*Check-in:* ${fmtDate(v.checkin)}`,
    `*Check-out:* ${fmtDate(v.checkout)}${n ? ` (${plural(n, "night")})` : ""}`,
    `*Guests:* ${v.guests}`,
    v.message.trim() ? `*Special requests:* ${v.message.trim()}` : null,
  ].filter((line) => line !== null).join("\n");
}

/** Quick availability check from the hero booking bar. */
export function availabilityMessage(f) {
  const n = nightsBetween(f.checkin, f.checkout);
  return [
    `Hello ${BRAND}! I'd like to check availability.`,
    "",
    `*Check-in:* ${fmtDate(f.checkin)}`,
    `*Check-out:* ${fmtDate(f.checkout)}${n ? ` (${plural(n, "night")})` : ""}`,
    `*Guests:* ${f.guests}`,
  ].join("\n");
}

/** Newsletter sign-up from the footer. */
export const newsletterMessage = (email) =>
  `Hello ${BRAND}! Please add me to your newsletter for seasonal offers and travel inspiration.\n\n*Email:* ${email.trim()}`;
