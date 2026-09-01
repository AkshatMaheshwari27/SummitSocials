export type EventAvailability = {
  seatsLeft: number;
  total: number;
  /** "open" · "filling" (<=20% of capacity left) · "full" */
  state: "open" | "filling" | "full";
  filling: boolean;
  full: boolean;
  label: string;
};

/**
 * Presentation-only availability, derived from the workshop capacity and the
 * paid-registration count. One place so the hero, the event card, and the
 * closing CTA always describe seats the same way.
 */
export function getEventAvailability(
  capacity: number,
  paidCount: number,
): EventAvailability {
  const seatsLeft = Math.max(capacity - paidCount, 0);
  const full = seatsLeft === 0;
  const filling = !full && seatsLeft <= Math.ceil(capacity * 0.2);

  const label = full
    ? "This workshop is full"
    : seatsLeft === capacity
      ? `${capacity} seats available`
      : `${seatsLeft} of ${capacity} seats left`;

  return {
    seatsLeft,
    total: capacity,
    state: full ? "full" : filling ? "filling" : "open",
    filling,
    full,
    label,
  };
}

/**
 * A minimal iCalendar VEVENT for a confirmed registration. Deterministic and
 * built entirely from the workshop row — meant to be served as a data: URI on
 * a download link, no endpoint required.
 */
export function buildIcs(opts: {
  uid: string;
  title: string;
  start: Date;
  durationMinutes: number;
  location: string;
}): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = new Date(opts.start.getTime() + opts.durationMinutes * 60_000);
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Summit Socials//Event Platform//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${fmt(opts.start)}`,
    `DTSTART:${fmt(opts.start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(opts.title)}`,
    `LOCATION:${esc(opts.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
