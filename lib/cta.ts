import { getMyRegistration } from "@/lib/registration";
import { formatRegistrationRef } from "@/lib/workshop";

export type PrimaryCta = {
  href: string;
  label: string;
  /** the visitor's registration state for the current event (CANCELLED → null) */
  registrationStatus: "PENDING" | "PAID" | null;
  /** SS-2026-… reference, present only once the registration is PAID */
  reference: string | null;
};

/**
 * The single "what should this visitor do next" action, shared by the site
 * header and the homepage so the two never disagree. Anonymous visitors are
 * routed through sign-in first; the label then follows their registration
 * state for the current event.
 */
export async function getPrimaryCta(
  userId: string | null | undefined,
): Promise<PrimaryCta> {
  if (!userId) {
    return {
      href: "/login?callbackUrl=/register",
      label: "Reserve a seat",
      registrationStatus: null,
      reference: null,
    };
  }

  const { registration } = await getMyRegistration(userId);
  const status =
    registration && registration.status !== "CANCELLED"
      ? registration.status
      : null;
  const reference =
    status === "PAID" ? formatRegistrationRef(registration!.id) : null;

  if (status === "PENDING") {
    return { href: "/checkout", label: "Complete payment", registrationStatus: status, reference };
  }
  if (status === "PAID") {
    return { href: "/dashboard", label: "You're going", registrationStatus: status, reference };
  }
  return { href: "/register", label: "Reserve a seat", registrationStatus: null, reference: null };
}
