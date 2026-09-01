import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/lib/motion";

type Cta = { href: string; label: string };

export function FinalCta({
  headline,
  price,
  capacity,
  cta,
  secondaryHref,
  seatsLabel,
  seatsFilling = false,
}: {
  headline: string;
  price: string;
  capacity: number;
  cta: Cta;
  secondaryHref: string;
  seatsLabel: string;
  seatsFilling?: boolean;
}) {
  return (
    <section className="border-t border-rule bg-sky-soft">
      <div className="wrap py-[var(--section-y)]">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="h-section text-balance">{headline}</h2>
            <p className="lede mt-4">
              {capacity} seats, {price}, and a live URL by the time you leave.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={cta.href} size="lg" variant="green">
                {cta.label} — {price}
                <Icon name="arrow-right" className="size-4" strokeWidth={2.25} />
              </ButtonLink>
              <ButtonLink href={secondaryHref} size="lg" variant="sky">
                See the schedule
              </ButtonLink>
            </div>
            <p className={"mt-4 font-mono text-[0.82rem] " + (seatsFilling ? "text-warn" : "text-ink-soft")}>
              {seatsLabel}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
