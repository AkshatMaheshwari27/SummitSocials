import Link from "next/link";

import { getSessionUser } from "@/lib/permissions";
import {
  formatPrice,
  formatWorkshopDate,
  getCurrentWorkshop,
} from "@/lib/workshop";

export default async function HomePage() {
  const [workshop, user] = await Promise.all([
    getCurrentWorkshop(),
    getSessionUser(),
  ]);

  const reserveHref = user ? "/register" : "/login?callbackUrl=/register";

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">
          A workshop in making things that last.
        </h1>

        {workshop ? (
          <ul className="font-mono text-sm text-black/70">
            <li>{formatWorkshopDate(workshop.date)}</li>
            <li>{workshop.location}</li>
            <li>{workshop.capacity} seats</li>
          </ul>
        ) : (
          <p className="text-sm text-black/60">
            Workshop details are being finalised.
          </p>
        )}

        <Link
          href={reserveHref}
          className="inline-block border border-black px-5 py-2.5 text-sm"
        >
          Reserve your seat
        </Link>
      </section>

      {workshop && (
        <>
          <section className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-black/60">
              The workshop
            </h2>
            <p className="max-w-prose leading-relaxed">{workshop.description}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-black/60">
              The details
            </h2>
            <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
              <dt className="text-black/50">Date</dt>
              <dd>{formatWorkshopDate(workshop.date)}</dd>
              <dt className="text-black/50">Location</dt>
              <dd>{workshop.location}</dd>
              <dt className="text-black/50">Capacity</dt>
              <dd>{workshop.capacity} seats</dd>
              <dt className="text-black/50">Price</dt>
              <dd>{formatPrice(workshop.priceMinor, workshop.currency)}</dd>
            </dl>
          </section>

          <section>
            <Link
              href={reserveHref}
              className="inline-block border border-black px-5 py-2.5 text-sm"
            >
              Reserve — {formatPrice(workshop.priceMinor, workshop.currency)}
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
