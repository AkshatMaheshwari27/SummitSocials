import type { ReactNode } from "react";

import { StatusBadge } from "@/components/ui/StatusBadge";

type Row = { label: string; value: string };

export function RegistrationCard({
  org,
  workshopTitle,
  reference,
  rows,
  registrationStatus,
  paymentStatus,
  placeholder = false,
  children,
}: {
  org: string;
  workshopTitle: string;
  reference: string;
  rows: Row[];
  registrationStatus?: string;
  paymentStatus?: string;
  placeholder?: boolean;
  children?: ReactNode;
}) {
  if (placeholder) {
    return (
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-dashed border-rule-strong p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-faint">
          {org}
        </p>
        <h2 className="mt-3 font-display text-lg font-medium text-ink">
          No seat reserved yet
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-rule">
      <div className="border-b border-rule px-6 py-5">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-faint">
          {org}
        </p>
        <h2 className="mt-1.5 font-display text-xl font-medium tracking-tight text-ink">
          {workshopTitle}
        </h2>
        {reference && (
          <p className="mt-2 font-mono text-sm text-ink-soft">{reference}</p>
        )}
      </div>

      <div className="px-6 py-5">
        <dl className="grid gap-3">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-baseline justify-between gap-4 border-b border-rule pb-2.5 last:border-0 last:pb-0"
            >
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">
                {r.label}
              </dt>
              <dd className="text-right text-sm font-medium text-ink">
                {r.value}
              </dd>
            </div>
          ))}
        </dl>

        {(registrationStatus || paymentStatus) && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-rule pt-4">
            {registrationStatus && (
              <StatusBadge status={registrationStatus} prefix="Registration" />
            )}
            {paymentStatus && (
              <StatusBadge status={paymentStatus} prefix="Payment" />
            )}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
