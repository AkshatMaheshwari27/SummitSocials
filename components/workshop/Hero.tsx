import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Fact = { label: string; value: string };
type Cta = { href: string; label: string };

export function Hero({
  eyebrow,
  headline,
  tagline,
  intro,
  facts,
  cta,
  secondaryHref,
  secondaryLabel,
  seatsLabel,
}: {
  eyebrow: string;
  headline: string;
  tagline: string;
  intro: string;
  facts: Fact[];
  cta: Cta;
  secondaryHref: string;
  secondaryLabel: string;
  seatsLabel: string;
}) {
  return (
    <section className="bg-cream">
      <div className="wrap pb-[var(--section-y)] pt-16 sm:pt-24">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-green-ink">
          {eyebrow}
        </p>

        <h1 className="mt-6 max-w-[16ch] text-balance font-display font-medium leading-[1.02] tracking-[-0.02em] text-ink text-[clamp(2.75rem,7vw,5rem)]">
          {headline}
        </h1>

        <p className="mt-6 max-w-xl font-display text-xl italic text-ink-soft">
          {tagline}
        </p>
        <p className="lede mt-4 max-w-xl">{intro}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink href={cta.href} size="lg" variant="green">
            {cta.label}
            <Icon name="arrow-right" className="size-4" strokeWidth={2.25} />
          </ButtonLink>
          <ButtonLink href={secondaryHref} size="lg" variant="sky">
            {secondaryLabel}
          </ButtonLink>
        </div>
        <p className="meta mt-4">{seatsLabel}</p>

        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-rule pt-8 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
                {f.label}
              </dt>
              <dd className="mt-1 font-display text-lg text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
