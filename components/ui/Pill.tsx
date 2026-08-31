import type { ReactNode } from "react";

type Tone = "green" | "sky" | "coral" | "lavender" | "white";

// The .pill base carries the mono/uppercase/hairline treatment; tone only
// tints the text now that the pastel fills are retired.
const TONES: Record<Tone, string> = {
  green: "text-green-ink",
  sky: "text-ink-soft",
  coral: "text-ink-soft",
  lavender: "text-ink-soft",
  white: "text-ink-soft",
};

export function Pill({
  children,
  tone = "white",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={`pill ${TONES[tone]} ${className}`.trim()}>{children}</span>
  );
}
