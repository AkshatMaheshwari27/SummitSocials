import { Icon, type IconName } from "@/components/ui/Icon";

type Meta = { tone: string; label: string; icon: IconName };

// Semantic colour only; the label + icon still carry the meaning without it.
const MAP: Record<string, Meta> = {
  PAID: { tone: "text-ok", label: "Paid", icon: "check" },
  PENDING: { tone: "text-warn", label: "Pending", icon: "clock" },
  FAILED: { tone: "text-danger", label: "Failed", icon: "plug" },
  CANCELLED: { tone: "text-ink-faint", label: "Cancelled", icon: "tag" },
  REFUNDED: { tone: "text-ink-faint", label: "Refunded", icon: "tag" },
};

export function StatusBadge({
  status,
  prefix,
}: {
  status?: string | null;
  prefix?: string;
}) {
  const key = String(status ?? "").toUpperCase();
  const meta: Meta = MAP[key] ?? {
    tone: "text-ink-faint",
    label: status ? String(status) : "—",
    icon: "tag",
  };

  return (
    <span className={`pill ${meta.tone}`} role={prefix ? undefined : "status"}>
      <Icon name={meta.icon} className="size-3.5" strokeWidth={2.5} />
      {prefix ? `${prefix}: ${meta.label}` : meta.label}
    </span>
  );
}
