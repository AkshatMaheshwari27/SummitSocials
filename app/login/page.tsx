import { redirect } from "next/navigation";

import { auth, signIn } from "@/lib/auth";

function safeCallbackUrl(value: string | undefined): string {
  // Only allow same-origin relative paths — never an absolute or //-prefixed URL.
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/dashboard";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const session = await auth();

  const target = safeCallbackUrl(callbackUrl);
  if (session?.user) {
    redirect(target);
  }

  return (
    <div className="max-w-sm space-y-6">
      <h1 className="text-2xl font-semibold">You&apos;re on the list.</h1>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          Sign-in didn&apos;t complete. Please try again.
        </p>
      )}

      <div className="space-y-3">
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: target });
          }}
        >
          <button
            type="submit"
            className="w-full border border-black px-4 py-2.5 text-sm"
          >
            Continue with Google
          </button>
        </form>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: target });
          }}
        >
          <button
            type="submit"
            className="w-full border border-black px-4 py-2.5 text-sm"
          >
            Continue with GitHub
          </button>
        </form>
      </div>

      <p className="text-xs text-black/50">No password to remember.</p>
    </div>
  );
}
