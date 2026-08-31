import { Icon, type IconName } from "@/components/ui/Icon";

type Tone = "green" | "sky" | "coral" | "lavender";

// Editorial system: retired the pastel fills. The frame is a neutral hairline
// tile; `tone` now only nudges the icon colour (accent for "green").
const ICON_TONE: Record<Tone, string> = {
  green: "text-green-ink",
  sky: "text-ink-soft",
  coral: "text-ink-soft",
  lavender: "text-ink-soft",
};

const SIZES = {
  sm: "size-10",
  md: "size-12",
  lg: "size-14",
} as const;

export function IconTile({
  icon,
  tone = "green",
  size = "md",
  className = "",
}: {
  icon: IconName;
  tone?: Tone;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span className={`tile ${SIZES[size]} ${className}`.trim()}>
      <Icon
        name={icon}
        className={`${size === "lg" ? "size-6" : "size-5"} ${ICON_TONE[tone]}`}
        strokeWidth={2}
      />
    </span>
  );
}
