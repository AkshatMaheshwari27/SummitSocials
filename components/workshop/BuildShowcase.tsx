import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/lib/motion";

/** Illustrative mock of the shape of the project — a code pane feeding a running app. Not a real attendee build. */
export function BuildShowcase() {
  return (
    <Reveal>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-md border border-rule bg-surface">
          <div className="flex items-center gap-2 border-b border-rule bg-surface-2 px-4 py-2.5">
            <Icon name="code" className="size-3.5 text-ink-faint" strokeWidth={2} />
            <span className="font-mono text-xs text-ink-soft">app/api/ask.ts</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[0.78rem] leading-relaxed text-ink-soft">
            <code>{`const res = await ai.generate({
  system: "You are a concise study assistant.",
  prompt: userQuestion,
  schema: Answer,
});

return Response.json(res.object);`}</code>
          </pre>
        </div>

        <div className="overflow-hidden rounded-md border border-rule bg-surface">
          <div className="flex items-center justify-between border-b border-rule bg-surface-2 px-4 py-2.5">
            <span className="font-mono text-xs text-ink-soft">Study Assistant</span>
            <span className="pill">Demo</span>
          </div>
          <div className="space-y-3 p-5">
            <div className="ml-auto max-w-[85%] rounded-md rounded-br-[2px] border border-rule bg-surface-2 px-3.5 py-2 text-sm text-ink">
              Explain gradient descent in two sentences.
            </div>
            <div className="max-w-[90%] rounded-md rounded-bl-[2px] border border-rule px-3.5 py-2 text-sm text-ink-soft">
              Gradient descent nudges a model&rsquo;s parameters toward less
              error, one small step at a time. Repeat until the error stops
              improving.
            </div>
            <p className="flex items-center gap-1.5 pt-1 font-mono text-xs text-ink-faint">
              <Icon name="check" className="size-3.5" strokeWidth={2.5} />
              structured output validated
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
