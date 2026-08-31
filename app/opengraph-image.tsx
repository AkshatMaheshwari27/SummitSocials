import { ImageResponse } from "next/og";

export const alt = "Summit Socials — Prompt to Product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated, non-photographic share card — pure type on cool paper.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f5f7",
          color: "#191f28",
          padding: 80,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            color: "#566173",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #c2c9d2",
              borderRadius: 10,
              color: "#191f28",
            }}
          >
            S
          </div>
          Summit Socials
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 74, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            Connecting builders, shipping tomorrow&rsquo;s tech.
          </div>
          <div style={{ fontSize: 28, color: "#2456c9" }}>
            Prompt to Product &nbsp;·&nbsp; 12 October 2026 &nbsp;·&nbsp; SRMIST, Kattankulathur
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
