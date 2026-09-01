import { redirect } from "next/navigation";

import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatPrice, formatWorkshopDate } from "@/lib/workshop";

const EVENT_TIME = "10:00 AM – 1:00 PM";

const NEXT_STEPS = [
  "Pay securely on Stripe — you'll come straight back here.",
  "We email your confirmation from Summit Socials.",
  "Your seat shows as confirmed on your dashboard.",
];

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;
  const user = await requireUser();
  const { workshop, registration } = await getMyRegistration(user.id);

  if (!workshop) {
    return (
      <Container className="py-[var(--section-y)]">
        <p className="lede">Checkout isn&rsquo;t available yet.</p>
      </Container>
    );
  }
  if (!registration || registration.status === "CANCELLED") {
    redirect("/register");
  }
  if (registration.status === "PAID" || registration.payment?.status === "PAID") {
    redirect("/dashboard");
  }

  const price = formatPrice(workshop.priceMinor, workshop.currency);

  return (
    <Container className="py-[var(--section-y)]">
      <div className="mx-auto max-w-lg">
        <Pill tone="green">Step 2 of 2</Pill>
        <h1 className="h-section mt-4">Confirm and pay</h1>

        {canceled && (
          <p
            role="status"
            className="mt-6 rounded-md border border-warn bg-warn-soft px-4 py-3 text-sm font-medium text-ink"
          >
            Payment wasn&rsquo;t completed. Your seat is still held &mdash; pay
            whenever you&rsquo;re ready.
          </p>
        )}

        <div className="mt-8 rounded-[var(--radius-lg)] border border-rule">
          <div className="border-b border-rule p-6">
            <h2 className="font-display text-xl font-medium tracking-tight text-ink">
              {workshop.title}
            </h2>
            <p className="meta mt-2">
              {formatWorkshopDate(workshop.date)} &middot; {EVENT_TIME} &middot;{" "}
              {workshop.location}
            </p>
          </div>

          <div className="p-6">
            <dl className="flex items-baseline justify-between text-sm">
              <dt className="text-ink-soft">Workshop seat</dt>
              <dd className="font-mono tabular-nums text-ink">{price}</dd>
            </dl>
            <dl className="mt-3 flex items-baseline justify-between border-t border-rule-strong pt-3">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-display text-2xl font-medium tracking-tight tabular-nums text-ink">
                {price}
              </dd>
            </dl>

            <div className="mt-6">
              <CheckoutButton amountLabel={price} />
            </div>
            <p className="mt-3 font-mono text-xs text-ink-faint">
              You&rsquo;ll be redirected to Stripe. Test mode &mdash; use card
              4242 4242 4242 4242, any future expiry, any CVC.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-faint">
            What happens next
          </p>
          <ol className="mt-3 border-t border-rule">
            {NEXT_STEPS.map((step, i) => (
              <li
                key={step}
                className="grid grid-cols-[1.5rem_1fr] gap-3 border-b border-rule py-3 text-sm text-ink-soft"
              >
                <span className="font-mono text-ink-faint">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Container>
  );
}
