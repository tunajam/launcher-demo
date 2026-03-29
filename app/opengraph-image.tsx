import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "⌘K Launcher — shadcn Registry Component";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            padding: "8px 16px",
            border: "1px solid rgba(255,255,255,0.15)",
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.05em",
          }}
        >
          📦 shadcn registry component
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#fafafa",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            ⌘K Launcher
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            with drill-down
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "32px",
            fontSize: "22px",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.5,
            maxWidth: "700px",
          }}
        >
          Hierarchical navigation, fuzzy search, keyboard-first UX. Built on
          shadcn + Zustand + cmdk.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: "16px",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.02em",
          }}
        >
          launcher.tunajam.com
        </div>
      </div>
    ),
    { ...size }
  );
}
