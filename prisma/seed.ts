import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * The single workshop AFTERIMAGE sells.
 *
 * priceMinor is in the smallest currency unit (paise). ₹999.00 -> 99900.
 * This value is the only source of truth for the amount charged by Stripe.
 */
const WORKSHOP = {
  slug: "afterimage-2026",
  title: "AFTERIMAGE",
  description:
    "One day. Forty-eight seats. We work through a single object from first " +
    "sketch to finished piece — ideation, prototyping, building, shipping — " +
    "and leave with something real, not a certificate. Lunch and materials " +
    "are included. Bring a notebook and a project you have been putting off.",
  date: new Date("2026-10-12T09:00:00+05:30"),
  location: "Bengaluru",
  priceMinor: 99900,
  currency: "inr",
  capacity: 48,
} as const;

async function main() {
  const workshop = await prisma.workshop.upsert({
    where: { slug: WORKSHOP.slug },
    update: {
      title: WORKSHOP.title,
      description: WORKSHOP.description,
      date: WORKSHOP.date,
      location: WORKSHOP.location,
      priceMinor: WORKSHOP.priceMinor,
      currency: WORKSHOP.currency,
      capacity: WORKSHOP.capacity,
    },
    create: { ...WORKSHOP },
  });

  console.log(
    `Seeded workshop "${workshop.title}" (${workshop.slug}) — ` +
      `${workshop.currency.toUpperCase()} ${(workshop.priceMinor / 100).toFixed(2)}, ` +
      `${workshop.priceMinor} minor units, ${workshop.capacity} seats.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
