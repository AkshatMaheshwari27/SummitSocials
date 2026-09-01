import { Reveal } from "@/lib/motion";

export type LearnItem = {
  n: string;
  title: string;
  body: string;
};

export function LearnGrid({ items }: { items: LearnItem[] }) {
  return (
    <ol className="border-t border-rule">
      {items.map((item, i) => (
        <Reveal key={item.n} as="li" delay={i * 0.03}>
          <div className="grid grid-cols-[2rem_1fr] gap-x-4 gap-y-1 border-b border-rule py-5">
            <span className="font-mono text-sm text-ink-faint">{item.n}</span>
            <h4 className="font-display text-lg font-medium text-ink">
              {item.title}
            </h4>
            <span aria-hidden />
            <p className="text-sm leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
