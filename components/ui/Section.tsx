import type { ReactNode } from "react";

import { Reveal } from "@/lib/motion";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  band = false,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  band?: boolean;
  children: ReactNode;
}) {
  const hasHeader = Boolean(eyebrow || title || intro);

  return (
    <section
      id={id}
      aria-labelledby={title && id ? `${id}-title` : undefined}
      className={band ? "border-y border-rule bg-sky-soft" : "bg-cream"}
    >
      <div className="wrap py-[var(--section-y)]">
        {hasHeader && (
          <Reveal className="max-w-2xl">
            {eyebrow && (
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-green-ink">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                id={id ? `${id}-title` : undefined}
                className="h-section mt-3 text-balance"
              >
                {title}
              </h2>
            )}
            {intro && <p className="lede mt-4">{intro}</p>}
          </Reveal>
        )}
        <div className={hasHeader ? "mt-12" : ""}>{children}</div>
      </div>
    </section>
  );
}
