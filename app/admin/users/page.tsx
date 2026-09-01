import type { RegistrationStatus } from "@prisma/client";

import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listRegistrations } from "@/lib/admin";

const STATUS_OPTIONS = ["ALL", "PENDING", "PAID", "CANCELLED"] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function parseStatus(value: string | undefined): StatusOption {
  return STATUS_OPTIONS.includes(value as StatusOption)
    ? (value as StatusOption)
    : "ALL";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const statusOption = parseStatus(status);

  // listRegistrations() calls requireAdmin(): non-admins get a 404 here.
  const rows = await listRegistrations({
    q,
    status:
      statusOption === "ALL" ? "ALL" : (statusOption as RegistrationStatus),
  });

  return (
    <Container className="py-[var(--section-y)]">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
        Event management
      </p>
      <h1 className="h-section mt-3">All registrations</h1>

      <form method="get" className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
            strokeWidth={2}
          />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name, email, organization"
            aria-label="Search registrations"
            className="field-input w-72 pl-9"
          />
        </div>
        <input type="hidden" name="status" value={statusOption} />
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const active = opt === statusOption;
            return (
              <button
                key={opt}
                type="submit"
                name="status"
                value={opt}
                aria-pressed={active}
                className={
                  "rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.06em] transition-colors " +
                  (active
                    ? "border-green bg-green text-white"
                    : "border-rule-strong bg-surface text-ink-soft hover:text-ink")
                }
              >
                {opt.charAt(0) + opt.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </form>

      <p className="mt-6 font-mono text-xs text-ink-soft">
        {rows.length} {rows.length === 1 ? "registration" : "registrations"}
      </p>

      <div className="mt-3 overflow-x-auto rounded-[var(--radius-lg)] border border-rule">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-surface-2 text-left">
              <th className="sticky left-0 bg-surface-2 px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft">
                Name
              </th>
              <th className="px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft">
                Email
              </th>
              <th className="px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft">
                Reference
              </th>
              <th className="px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft">
                Registration
              </th>
              <th className="px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft">
                Payment
              </th>
              <th className="px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft">
                Placed
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-rule last:border-0 hover:bg-surface-2"
              >
                <td className="sticky left-0 bg-surface px-4 py-3 font-medium text-ink">
                  {r.fullName}
                </td>
                <td className="px-4 py-3 text-ink-soft">{r.email}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                  {r.ref}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.paymentStatus} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-ink-soft">
                  {DATE_FMT.format(new Date(r.createdAt))}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-faint">
                  No registrations match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
