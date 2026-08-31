import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Summit Socials mark — generated, non-photographic.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2456c9",
          color: "#ffffff",
          fontSize: 22,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
