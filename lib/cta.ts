import { getMyRegistration } from "@/lib/registration";

export type PrimaryCta = { href: string; label: string };

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
    return { href: "/login?callbackUrl=/register", label: "Reserve a seat" };
  }

  const { registration } = await getMyRegistration(userId);
  if (registration?.status === "PENDING") {
    return { href: "/checkout", label: "Complete payment" };
  }
  if (registration?.status === "PAID") {
    return { href: "/dashboard", label: "You're going" };
  }
  return { href: "/register", label: "Reserve a seat" };
}
