import { ImageResponse } from "next/og";
import { OG_COLORS, OG_HOOKS, OG_IMAGE_SIZE } from "./const";
import type { OgImageContent } from "./types";

export function renderOgImage({
  eyebrow,
  title,
  example,
  exampleAmount,
}: OgImageContent) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: OG_COLORS.background,
          color: OG_COLORS.foreground,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: OG_COLORS.foreground,
              color: OG_COLORS.background,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 34 }}>SettleMates</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, color: OG_COLORS.primary }}>{eyebrow}</div>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 28, color: OG_COLORS.muted }}>{OG_HOOKS}</div>
          <div
            style={{
              display: "flex",
              gap: 24,
              padding: "18px 28px",
              borderRadius: 14,
              border: `2px solid ${OG_COLORS.border}`,
              background: OG_COLORS.primaryTint,
              fontSize: 30,
            }}
          >
            <span>{example}</span>
            <span style={{ color: OG_COLORS.primary }}>{exampleAmount}</span>
          </div>
        </div>
      </div>
    ),
    OG_IMAGE_SIZE,
  );
}
