import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { NavMobile } from "@/components/navigation/NavMobile";
import { auth, signOut } from "@/lib/auth";
import { getPrimaryCta } from "@/lib/cta";

const NAV_LINKS = [
  { href: "/#whats-on", label: "What's on" },
  { href: "/#about", label: "About" },
];

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-[5px] border border-rule-strong font-display text-sm font-semibold text-ink"
      >
        S
      </span>
      <span className="font-display text-lg font-medium tracking-tight text-ink">
        Summit Socials
      </span>
    </span>
  );
}

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;
  const cta = await getPrimaryCta(user?.id);

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="sticky top-0 z-40 border-b border-rule bg-cream">
      <header className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Summit Socials home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <form action={doSignOut}>
              <button
                type="submit"
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Sign in
            </Link>
          )}
          <ButtonLink href={cta.href} size="sm" variant="green">
            {cta.label}
          </ButtonLink>
        </div>

        <NavMobile
          links={NAV_LINKS}
          isAuthed={Boolean(user)}
          signOutAction={doSignOut}
          cta={cta}
        />
      </header>
    </div>
  );
}
