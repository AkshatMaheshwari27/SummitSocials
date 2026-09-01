import { RegistrationCard } from "@/components/registration/RegistrationCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { signOut } from "@/lib/auth";
import { buildIcs } from "@/lib/event";
import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatRegistrationRef, formatWorkshopDate } from "@/lib/workshop";

const ORG = "Summit Socials";
const EVENT_TIME = "10:00 AM – 1:00 PM";
const EVENT_MINUTES = 180;

export default async function DashboardPage() {
  const user = await requireUser();
  const { workshop, registration } = await getMyRegistration(user.id);
  const hasRegistration = registration && registration.status !== "CANCELLED";
  const paid =
    hasRegistration &&
    (registration.status === "PAID" || registration.payment?.status === "PAID");
  const firstName = user.name?.split(" ")[0];

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  const statusLine = !hasRegistration
    ? "You haven't reserved a seat yet."
    : registration.status === "PENDING"
      ? "Your seat is held. One step left — payment."
      : `You're confirmed for ${registration.workshop.title}.`;

  return (
    <Container className="py-[var(--section-y)]">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
          Your dashboard
        </p>
        <h1 className="h-section mt-3">
          {firstName ? `Hi ${firstName}` : "Welcome"}
        </h1>
        <p className="lede mt-3">{statusLine}</p>
      </div>

      <div className="mt-10 max-w-md">
        {!hasRegistration ? (
          <RegistrationCard
            org={ORG}
            placeholder
            workshopTitle={workshop?.title ?? ""}
            reference=""
            rows={[]}
          >
            <p className="text-sm text-ink-soft">
              Reserve your seat for {workshop?.title ?? "the next workshop"}.
            </p>
            <div className="mt-4">
              <ButtonLink href="/register" size="sm">
                Reserve a seat
              </ButtonLink>
            </div>
          </RegistrationCard>
        ) : (
          <RegistrationCard
            org={ORG}
            workshopTitle={registration.workshop.title}
            reference={formatRegistrationRef(registration.id)}
            rows={[
              {
                label: "Date",
                value: formatWorkshopDate(registration.workshop.date),
              },
              { label: "Time", value: EVENT_TIME },
              { label: "Where", value: registration.workshop.location },
            ]}
            registrationStatus={registration.status}
            paymentStatus={registration.payment?.status ?? undefined}
          >
            {registration.status === "PENDING" && (
              <div className="border-t border-rule bg-warn-soft px-6 py-5">
                <p className="text-sm font-medium text-ink">
                  Your seat is held, but payment isn&rsquo;t complete yet.
                </p>
                <div className="mt-3">
                  <ButtonLink href="/checkout" size="sm">
                    Complete payment
                  </ButtonLink>
                </div>
              </div>
            )}
          </RegistrationCard>
        )}
      </div>

      {paid && (
        <div className="mt-6 max-w-md">
          <a
            className="btn btn-white btn-sm"
            href={`data:text/calendar;charset=utf-8,${encodeURIComponent(
              buildIcs({
                uid: `${registration.workshopId}@summitsocials`,
                title: registration.workshop.title,
                start: registration.workshop.date,
                durationMinutes: EVENT_MINUTES,
                location: registration.workshop.location,
              }),
            )}`}
            download="prompt-to-product.ics"
          >
            Add to calendar
          </a>
        </div>
      )}

      <div className="mt-14 flex max-w-md items-center justify-between border-t border-rule pt-5">
        <span className="meta">{user.email}</span>
        <form action={signOutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </div>
    </Container>
  );
}
