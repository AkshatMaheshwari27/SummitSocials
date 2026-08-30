import { redirect } from "next/navigation";

import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatPrice } from "@/lib/workshop";

export default async function RegisterPage() {
  const user = await requireUser();
  const { workshop, registration } = await getMyRegistration(user.id);

  if (!workshop) {
    return <p className="text-sm text-black/60">Registration isn&apos;t open yet.</p>;
  }
  if (registration && registration.status === "PAID") {
    redirect("/dashboard");
  }
  if (registration && registration.status === "PENDING") {
    redirect("/checkout");
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Reserve your seat</h1>
        <p className="text-sm text-black/60">
          {workshop.title} — {formatPrice(workshop.priceMinor, workshop.currency)}.
          One registration per person.
        </p>
      </div>
      <RegistrationForm
        defaultValues={{
          fullName: user.name ?? "",
          email: user.email ?? "",
        }}
      />
    </div>
  );
}
