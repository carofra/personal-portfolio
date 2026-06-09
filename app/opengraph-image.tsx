import { ImageResponse } from "next/og";
import { siteConfig } from "./site.config";

export const alt = `${siteConfig.fullName} - ${siteConfig.role}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f9f9f9",
          color: "#111111",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <span>Portfolio</span>
          <span>2026</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 112,
              lineHeight: 0.9,
              letterSpacing: "-0.06em",
              textTransform: "uppercase",
              maxWidth: 850,
            }}
          >
            {siteConfig.fullName}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontSize: 36,
              color: "#e33b2b",
            }}
          >
            <span>{siteConfig.role}</span>
          </div>
        </div>
        <div style={{ fontSize: 30, maxWidth: 760, lineHeight: 1.25 }}>
          {siteConfig.bio.en}
        </div>
      </div>
    ),
    size,
  );
}
