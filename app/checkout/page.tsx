import { redirect } from "next/navigation";

import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatPrice, formatWorkshopDate } from "@/lib/workshop";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;
  const user = await requireUser();
  const { workshop, registration } = await getMyRegistration(user.id);

  if (!workshop) {
    return <p className="text-sm text-black/60">Checkout isn&apos;t available yet.</p>;
  }
  if (!registration || registration.status === "CANCELLED") {
    redirect("/register");
  }
  if (registration.status === "PAID" || registration.payment?.status === "PAID") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {canceled && (
        <p
          role="status"
          className="border border-black/20 bg-black/[0.03] px-4 py-3 text-sm"
        >
          Payment not completed. Your registration is saved — you can return to
          checkout when you&apos;re ready.
        </p>
      )}

      <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
        <dt className="text-black/50">Workshop</dt>
        <dd>{workshop.title}</dd>
        <dt className="text-black/50">Date</dt>
        <dd>{formatWorkshopDate(workshop.date)}</dd>
        <dt className="text-black/50">Location</dt>
        <dd>{workshop.location}</dd>
        <dt className="text-black/50">Amount</dt>
        <dd>{formatPrice(workshop.priceMinor, workshop.currency)}</dd>
      </dl>

      <p className="text-xs text-black/50">
        Payments are processed by Stripe in test mode. Use card 4242 4242 4242
        4242 with any future expiry and any CVC.
      </p>

      <CheckoutButton />
    </div>
  );
}
