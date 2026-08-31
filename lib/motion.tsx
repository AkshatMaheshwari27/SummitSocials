"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";

/**
 * Entrance reveal.
 *
 * Renders children fully visible on the server and on first paint — SSR,
 * no-JS, and reduced-motion all get the final state immediately. After mount,
 * only elements that start *below* the fold fade + rise into view; anything
 * already on screen is left untouched, so above-the-fold content is never
 * hidden waiting on hydration.
 *
 * A hard failsafe reveals every element after 1.2s no matter what, so content
 * can never be left stuck if IntersectionObserver never delivers (headless
 * renderers, some embedded webviews).
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const DUR = { xs: 0.12, sm: 0.2, md: 0.34, lg: 0.5 } as const;

type As = "div" | "li" | "ul" | "ol" | "section" | "span";

export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: As;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // Never touch anything already at or above the fold.
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.9) return;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.transition =
      `opacity 0.5s ${delay}s cubic-bezier(0.16,1,0.3,1),` +
      `transform 0.5s ${delay}s cubic-bezier(0.16,1,0.3,1)`;

    const failsafe = window.setTimeout(reveal, 1200);

    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              reveal();
              io?.disconnect();
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      io.observe(el);
    } else {
      reveal();
    }

    return () => {
      window.clearTimeout(failsafe);
      io?.disconnect();
    };
  }, [delay]);

  return createElement(as as "div", { ref, className }, children);
}

export function StaggerChildren({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
}) {
  return createElement("div", className ? { className } : {}, children);
}
