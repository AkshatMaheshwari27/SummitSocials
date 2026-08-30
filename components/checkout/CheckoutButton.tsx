"use client";

import { useState } from "react";

export function CheckoutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.code === "ALREADY_PAID") {
        window.location.href = "/dashboard";
        return;
      }
      setError(data.error ?? "Could not start checkout. Please try again.");
      setPending(false);
    } catch {
      setError("Network error. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={start}
        disabled={pending}
        className="border border-black px-5 py-2.5 text-sm disabled:opacity-50"
      >
        {pending ? "Redirecting to checkout…" : "Pay with card"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
