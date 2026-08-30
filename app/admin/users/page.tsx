import type { RegistrationStatus } from "@prisma/client";

import { listRegistrations } from "@/lib/admin";

const STATUS_OPTIONS = ["ALL", "PENDING", "PAID", "CANCELLED"] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
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
      statusOption === "ALL"
        ? "ALL"
        : (statusOption as RegistrationStatus),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Registered users</h1>

      <form method="get" className="flex flex-wrap items-end gap-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-black/50">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Name, email, organization"
            className="border border-black/30 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-black/50">Status</span>
          <select
            name="status"
            defaultValue={statusOption}
            className="border border-black/30 px-3 py-2"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="border border-black px-4 py-2">
          Apply
        </button>
      </form>

      <p className="text-xs text-black/50">
        {rows.length} {rows.length === 1 ? "registration" : "registrations"}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/20 text-left font-mono text-xs uppercase tracking-[0.1em] text-black/50">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Registration</th>
              <th className="py-2 pr-4">Payment</th>
              <th className="py-2 pr-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-black/10 align-top">
                <td className="py-2 pr-4">{row.fullName}</td>
                <td className="py-2 pr-4">{row.email}</td>
                <td className="py-2 pr-4 font-mono">
                  {row.ref}
                  <span className="block text-xs text-black/40">
                    {row.status}
                  </span>
                </td>
                <td className="py-2 pr-4">{row.paymentStatus ?? "—"}</td>
                <td className="py-2 pr-4 whitespace-nowrap">
                  {DATE_FORMAT.format(new Date(row.createdAt))}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-black/50">
                  No registrations match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
