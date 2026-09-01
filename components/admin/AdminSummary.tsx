type Stat = { label: string; value: string };

export function AdminSummary({
  filled,
  capacity,
  stats,
}: {
  filled: number;
  capacity: number | null;
  stats: Stat[];
}) {
  const pct =
    capacity && capacity > 0
      ? Math.min(100, Math.round((filled / capacity) * 100))
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-[var(--radius-lg)] border border-rule p-5">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
          Seats filled
        </p>
        <p className="mt-1 font-display text-3xl font-medium tabular-nums tracking-tight text-ink">
          {filled}
          <span className="text-ink-faint">
            {capacity != null ? ` / ${capacity}` : ""}
          </span>
        </p>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-rule"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Seats filled"
        >
          <div className="h-full bg-green" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-[var(--radius-lg)] border border-rule p-5"
        >
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
            {s.label}
          </p>
          <p className="mt-1 font-display text-3xl font-medium tabular-nums tracking-tight text-ink">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
