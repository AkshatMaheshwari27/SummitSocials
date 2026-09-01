import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/lib/motion";

type Fact = { label: string; value: string };
type Cta = { href: string; label: string };

export function WorkshopHighlight({
  title,
  lede,
  description,
  facts,
  price,
  cta,
  seatsLabel,
  full,
}: {
  title: string;
  lede: string;
  description: string;
  facts: Fact[];
  price: string;
  cta: Cta;
  seatsLabel: string;
  full: boolean;
}) {
  return (
    <Reveal>
      <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-rule lg:grid-cols-[1.5fr_1fr]">
        <div className="bg-surface p-8 sm:p-10">
          <h3 className="font-display text-3xl font-medium tracking-tight text-ink">
            {title}
          </h3>
          <p className="mt-3 max-w-prose text-lg text-ink">{lede}</p>
          <p className="mt-4 max-w-prose leading-relaxed text-ink-soft">
            {description}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-8 bg-surface p-8 sm:p-10">
          <dl className="grid gap-4">
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-4 border-b border-rule pb-3 last:border-0 last:pb-0"
              >
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">
                  {f.label}
                </dt>
                <dd className="text-right text-sm font-medium text-ink">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-faint">
              One-time fee
            </p>
            <p className="mt-1 font-display text-4xl font-medium tracking-tight text-ink">
              {price}
            </p>
            {full ? (
              <button
                type="button"
                disabled
                className="btn btn-white mt-4 w-full"
              >
                This workshop is full
              </button>
            ) : (
              <ButtonLink href={cta.href} variant="green" className="mt-4 w-full">
                {cta.label}
              </ButtonLink>
            )}
            <p className="meta mt-3 text-center">{seatsLabel}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
