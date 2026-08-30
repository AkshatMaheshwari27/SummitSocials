import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatRegistrationRef } from "@/lib/workshop";

/**
 * Reaching this page is NOT proof of payment. The status shown here comes
 * from our database, which is only updated by the verified Stripe webhook.
 */
export default async function SuccessPage() {
  const user = await requireUser();
  const { registration } = await getMyRegistration(user.id);

  if (!registration) {
    redirect("/register");
  }

  const paid =
    registration.status === "PAID" || registration.payment?.status === "PAID";

  if (paid) {
    return (
      <div className="max-w-lg space-y-4">
        <h1 className="text-2xl font-semibold">Registration confirmed</h1>
        <p className="text-sm">Your payment has been received.</p>
        <p className="text-sm text-black/60">
          We&apos;ve sent your confirmation to {registration.email}.
        </p>
        <p className="font-mono text-sm">
          {formatRegistrationRef(registration.id)}
        </p>
        <Link
          href="/dashboard"
          className="inline-block border border-black px-5 py-2.5 text-sm"
        >
          View my registration
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Payment processing</h1>
      <p className="text-sm">
        We&apos;re verifying your payment with Stripe. This page reflects your
        registration status from our records, not the checkout redirect —
        refresh in a moment.
      </p>
      <Link
        href="/dashboard"
        className="inline-block border border-black px-5 py-2.5 text-sm"
      >
        Go to my dashboard
      </Link>
    </div>
  );
}
