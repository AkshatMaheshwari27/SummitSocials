import { AdminSummary } from "@/components/admin/AdminSummary";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAdminOverview, listRegistrations } from "@/lib/admin";
import { formatPrice, getCurrentWorkshop } from "@/lib/workshop";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});

export default async function AdminPage() {
  // getAdminOverview() / listRegistrations() call requireAdmin():
  // a signed-in non-admin gets a 404 here; anonymous is sent to /login.
  const [overview, recent, workshop] = await Promise.all([
    getAdminOverview(),
    listRegistrations(),
    getCurrentWorkshop(),
  ]);

  const revenue = workshop
    ? formatPrice(overview.paid * workshop.priceMinor, workshop.currency)
    : "—";
  const rows = recent.slice(0, 8);

  return (
    <Container className="py-[var(--section-y)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
            Event management
          </p>
          <h1 className="h-section mt-3">Registrations</h1>
        </div>
        <ButtonLink href="/admin/users" variant="sky" size="sm">
          View all
        </ButtonLink>
      </div>

      <div className="mt-8">
        <AdminSummary
          filled={overview.paid}
          capacity={overview.capacity}
          stats={[
            { label: "Pending", value: String(overview.pending) },
            { label: "Cancelled", value: String(overview.cancelled) },
            { label: "Revenue", value: revenue },
          ]}
        />
      </div>

      <h2 className="mt-14 font-display text-lg font-medium tracking-tight text-ink">
        Recent registrations
      </h2>
      <div className="mt-4 overflow-x-auto rounded-[var(--radius-lg)] border border-rule">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-surface-2 text-left">
              <th className="px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft">
                Name
              </th>
              <th className="px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft">
                Email
              </th>
              <th className="px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft">
                Reference
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
                <td className="px-4 py-3 font-medium text-ink">{r.fullName}</td>
                <td className="px-4 py-3 text-ink-soft">{r.email}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                  {r.ref}
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
                <td colSpan={5} className="px-4 py-10 text-center text-ink-faint">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
