import Link from "next/link";

import { auth, signOut } from "@/lib/auth";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.2em]"
        >
          AFTERIMAGE
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className="underline-offset-4 hover:underline">
                Dashboard
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="underline-offset-4 hover:underline">
                  Admin
                </Link>
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="underline-offset-4 hover:underline"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="underline-offset-4 hover:underline">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
