import Link from "next/link";

import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatRegistrationRef, formatWorkshopDate } from "@/lib/workshop";

export default async function DashboardPage() {
  const user = await requireUser();
  const { registration } = await getMyRegistration(user.id);

  const hasRegistration =
    registration && registration.status !== "CANCELLED";

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Your registration</h1>

      {!hasRegistration ? (
        <p className="text-sm">
          You haven&apos;t registered yet.{" "}
          <Link href="/register" className="underline underline-offset-4">
            Register for the workshop
          </Link>
          .
        </p>
      ) : (
        <>
          <dl className="grid grid-cols-[9rem_1fr] gap-y-2 text-sm">
            <dt className="text-black/50">Workshop</dt>
            <dd>{registration.workshop.title}</dd>
            <dt className="text-black/50">Date</dt>
            <dd>{formatWorkshopDate(registration.workshop.date)}</dd>
            <dt className="text-black/50">Location</dt>
            <dd>{registration.workshop.location}</dd>
            <dt className="text-black/50">Registration</dt>
            <dd className="font-mono">
              {formatRegistrationRef(registration.id)}
            </dd>
            <dt className="text-black/50">Registration status</dt>
            <dd>{registration.status}</dd>
            <dt className="text-black/50">Payment</dt>
            <dd>{registration.payment?.status ?? "—"}</dd>
          </dl>

          {registration.status === "PENDING" && (
            <Link
              href="/checkout"
              className="inline-block border border-black px-5 py-2.5 text-sm"
            >
              Complete payment
            </Link>
          )}
        </>
      )}
    </div>
  );
}
