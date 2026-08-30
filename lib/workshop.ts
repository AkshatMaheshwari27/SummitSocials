import { prisma } from "@/lib/prisma";

/**
 * AFTERIMAGE sells a single workshop. It is identified by this slug and
 * created by `prisma/seed.ts`.
 */
export const CURRENT_WORKSHOP_SLUG = "afterimage-2026";

export async function getCurrentWorkshop() {
  return prisma.workshop.findUnique({
    where: { slug: CURRENT_WORKSHOP_SLUG },
  });
}

/** Format minor units (paise) as a display price, e.g. 99900 -> "₹999". */
export function formatPrice(minor: number, currency: string): string {
  const major = minor / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: major % 1 === 0 ? 0 : 2,
    }).format(major);
  } catch {
    return `${currency.toUpperCase()} ${major.toFixed(2)}`;
  }
}
