import { Reveal } from "@/lib/motion";

const FEATURES: { title: string; body: string }[] = [
  {
    title: "Hands-on the whole way",
    body: "No lecture-only stretches. You are building from the first 20 minutes.",
  },
  {
    title: "Made for beginners",
    body: "If you have written some code, you have enough to keep up.",
  },
  {
    title: "You leave with a deploy",
    body: "A live URL for the app you built, not a certificate.",
  },
  {
    title: "A builder community",
    body: "Run by Summit Socials — a community of people who like shipping things.",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-x-12 gap-y-8 border-t border-rule pt-8 sm:grid-cols-2">
      {FEATURES.map((f, i) => (
        <Reveal key={f.title} delay={i * 0.03}>
          <h3 className="font-display text-lg font-medium text-ink">{f.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.body}</p>
        </Reveal>
      ))}
    </div>
  );
}
