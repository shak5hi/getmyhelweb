import { ImageResponse } from "next/og";

export const alt = "GetMyHelp: domestic help, organised at the society level";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The picture shown when the site is shared on WhatsApp, LinkedIn, X and the like
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
          padding: 80,
          background: "#24123f",
          color: "#f7f4ee",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="88" height="88" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="15" fill="#5a2ca0" />
            <path d="M44.6 21.4A16 16 0 1 0 48 33H34" fill="none" stroke="#f2b33d" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>GetMyHelp</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3, maxWidth: 980 }}>
            Your maid shouldn’t be a monthly problem to solve.
          </div>
          <div style={{ fontSize: 34, color: "#f2b33d" }}>
            Verified helpers · Society-agreed rates · Household plans
          </div>
        </div>
      </div>
    ),
    size,
  );
}
