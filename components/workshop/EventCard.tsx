import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Cta = { href: string; label: string };

export type EventCardProps = {
  title: string;
  summary: string;
  /** day-of-month, e.g. "12" */
  day: string;
  /** e.g. "Oct 2026" */
  monthYear: string;
  /** e.g. "Monday" */
  weekday?: string;
  venue: string;
  price: string;
  availabilityLabel: string;
  filling?: boolean;
  full?: boolean;
  registrationStatus?: "PENDING" | "PAID" | "CANCELLED" | null;
  reference?: string | null;
  cta: Cta;
  detail?: ReactNode;
};

export function EventCard({
  title,
  summary,
  day,
  monthYear,
  weekday,
  venue,
  price,
  availabilityLabel,
  filling = false,
  full = false,
  registrationStatus = null,
  reference = null,
  cta,
  detail,
}: EventCardProps) {
  const registered =
    registrationStatus === "PENDING" || registrationStatus === "PAID";

  return (
    <article className="overflow-hidden rounded-[8px] border border-rule bg-surface">
      <div className="grid gap-px bg-rule sm:grid-cols-[auto_1fr_auto]">
        {/* date block */}
        <div className="flex flex-col items-start justify-center bg-surface px-6 py-5 sm:px-7">
          <span className="font-display text-4xl font-medium leading-none tracking-tight text-ink">
            {day}
          </span>
          <span className="meta mt-1 uppercase tracking-[0.08em]">
            {monthYear}
          </span>
          {weekday && (
            <span className="font-mono text-[0.7rem] text-ink-faint">
              {weekday}
            </span>
          )}
        </div>

        {/* identity */}
        <div className="bg-surface px-6 py-5 sm:px-7">
          <h3 className="font-display text-xl font-medium tracking-tight text-ink">
            {title}
          </h3>
          <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-ink-soft">
            {summary}
          </p>
          <p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-ink-faint">
            <Icon name="pin" className="size-3.5" strokeWidth={2} />
            {venue}
          </p>
        </div>

        {/* facts + action */}
        <div className="flex flex-col gap-3 bg-surface px-6 py-5 sm:items-end sm:px-7 sm:text-right">
          <div>
            <p className="font-display text-2xl font-medium tracking-tight text-ink">
              {price}
            </p>
            <p
              className={
                "mt-0.5 font-mono text-xs " +
                (filling ? "text-warn" : "text-ink-faint")
              }
            >
              {availabilityLabel}
            </p>
          </div>

          {registered && (
            <div className="flex flex-col gap-1 sm:items-end">
              <StatusBadge status={registrationStatus} prefix="Registration" />
              {registrationStatus === "PAID" && reference && (
                <span className="font-mono text-[0.7rem] text-ink-faint">
                  {reference}
                </span>
              )}
            </div>
          )}

          {full && !registered ? (
            <button
              type="button"
              disabled
              className="btn btn-white btn-sm w-full sm:w-auto"
            >
              Sold out
            </button>
          ) : (
            <ButtonLink
              href={cta.href}
              size="sm"
              variant="green"
              className="w-full sm:w-auto"
            >
              {cta.label}
            </ButtonLink>
          )}
        </div>
      </div>

      {detail && <div className="border-t border-rule px-6 py-6 sm:px-7">{detail}</div>}
    </article>
  );
}
