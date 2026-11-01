import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// The home-screen icon: the same marigold G as the browser tab, on brand violet
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#5a2ca0" }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <path d="M44.6 21.4A16 16 0 1 0 48 33H34" fill="none" stroke="#f2b33d" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
