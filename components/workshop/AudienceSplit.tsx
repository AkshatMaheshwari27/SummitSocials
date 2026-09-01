import { Reveal } from "@/lib/motion";

export function AudienceSplit({
  forItems,
  notItems,
}: {
  forItems: string[];
  notItems: string[];
}) {
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <Reveal>
        <h3 className="font-display text-lg font-medium text-ink">
          Come along if&hellip;
        </h3>
        <ul className="mt-4 space-y-3 border-t border-rule pt-4">
          {forItems.map((t) => (
            <li key={t} className="flex gap-3 text-sm text-ink">
              <span aria-hidden className="mt-0.5 font-mono text-green-ink">
                +
              </span>
              {t}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.05}>
        <h3 className="font-display text-lg font-medium text-ink-soft">
          Maybe not this one if&hellip;
        </h3>
        <ul className="mt-4 space-y-3 border-t border-rule pt-4">
          {notItems.map((t) => (
            <li key={t} className="flex gap-3 text-sm text-ink-soft">
              <span aria-hidden className="mt-0.5 font-mono text-ink-faint">
                &ndash;
              </span>
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
