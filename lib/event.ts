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
