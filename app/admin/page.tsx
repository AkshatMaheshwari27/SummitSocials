import Link from "next/link";

import { getAdminOverview } from "@/lib/admin";

export default async function AdminPage() {
  // getAdminOverview() calls requireAdmin(): non-admins get a 404 here.
  const overview = await getAdminOverview();

  const stats: Array<{ label: string; value: string | number }> = [
    { label: "Registrations", value: overview.total },
    { label: "Paid", value: overview.paid },
    { label: "Pending", value: overview.pending },
    { label: "Cancelled", value: overview.cancelled },
    {
      label: "Seats left",
      value:
        overview.seatsLeft != null && overview.capacity != null
          ? `${overview.seatsLeft} / ${overview.capacity}`
          : "—",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin</h1>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="border border-black/15 p-4">
            <dt className="font-mono text-xs uppercase tracking-[0.15em] text-black/50">
              {s.label}
            </dt>
            <dd className="mt-2 text-2xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <Link
        href="/admin/users"
        className="inline-block border border-black px-5 py-2.5 text-sm"
      >
        Registered users
      </Link>
    </div>
  );
}
