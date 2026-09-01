import { redirect } from "next/navigation";

import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatPrice, formatWorkshopDate } from "@/lib/workshop";

const EVENT_TIME = "10:00 AM – 1:00 PM";

export default async function RegisterPage() {
  const user = await requireUser();
  const { workshop, registration } = await getMyRegistration(user.id);

  if (!workshop) {
    return (
      <Container className="py-[var(--section-y)]">
        <div className="max-w-prose">
          <p className="pill">Summit Socials</p>
          <h1 className="h-section mt-4">Registration isn&rsquo;t open yet.</h1>
          <p className="lede mt-3">
            There&rsquo;s no event scheduled right now. This page will reopen
            once the next one is announced.
          </p>
        </div>
      </Container>
    );
  }
  if (registration && registration.status === "PAID") {
    redirect("/dashboard");
  }
  if (registration && registration.status === "PENDING") {
    redirect("/checkout");
  }

  const price = formatPrice(workshop.priceMinor, workshop.currency);
  const facts = [
    { label: "Date", value: formatWorkshopDate(workshop.date) },
    { label: "Time", value: EVENT_TIME },
    { label: "Venue", value: workshop.location },
  ];

  return (
    <Container className="py-[var(--section-y)]">
      <div className="mx-auto max-w-4xl">
        <Pill tone="green">Step 1 of 2</Pill>
        <h1 className="h-section mt-4">Reserve your seat</h1>
        <p className="lede mt-3 max-w-xl">
          Tell us who&rsquo;s coming. Next you&rsquo;ll confirm payment and your
          seat is locked in.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_19rem]">
          <Card className="p-6 sm:p-8">
            <RegistrationForm
              defaultValues={{
                fullName: user.name ?? "",
                email: user.email ?? "",
              }}
            />
          </Card>

          <aside className="h-fit rounded-[var(--radius-lg)] border border-rule p-6">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-faint">
              You&rsquo;re enrolling in
            </p>
            <h2 className="mt-2 font-display text-xl font-medium tracking-tight text-ink">
              {workshop.title}
            </h2>

            <dl className="mt-5 grid gap-3">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-4 border-b border-rule pb-2.5 last:border-0 last:pb-0"
                >
                  <dt className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">
                    {f.label}
                  </dt>
                  <dd className="text-right text-sm font-medium text-ink">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-rule-strong pt-4">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-faint">
                Total
              </span>
              <span className="font-display text-2xl font-medium tracking-tight text-ink">
                {price}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
}
