import { Reveal } from "@/lib/motion";

export type ScheduleItem = { time: string; title: string; detail?: string };

export function ScheduleTimeline({ items }: { items: ScheduleItem[] }) {
  return (
    <ol className="border-l border-rule-strong">
      {items.map((item, i) => (
        <Reveal
          key={item.time}
          as="li"
          delay={i * 0.03}
          className="relative pb-8 pl-6 last:pb-0"
        >
          <span
            aria-hidden
            className={
              "absolute -left-[5px] top-1.5 size-2.5 rounded-full border-2 border-cream " +
              (i === 0 ? "bg-green" : "bg-rule-strong")
            }
          />
          <span className="font-mono text-xs text-ink-faint">{item.time}</span>
          <h4 className="mt-0.5 font-display text-lg font-medium text-ink">
            {item.title}
          </h4>
          {item.detail && (
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {item.detail}
            </p>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
