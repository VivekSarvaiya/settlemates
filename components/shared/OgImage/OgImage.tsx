import { ImageResponse } from "next/og";
import { GLYPH_STROKE_WIDTH, SPLIT_GLYPH_PATHS } from "../AppIcon/const";
import { LONG_TITLE_LENGTH, OG_COLORS, OG_HOOKS, OG_IMAGE_SIZE } from "./const";
import type { OgImageContent } from "./types";

export function renderOgImage({ eyebrow, title, example }: OgImageContent) {
  const isLongTitle = title.length > LONG_TITLE_LENGTH;

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
              borderRadius: 14,
              background: OG_COLORS.foreground,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke={OG_COLORS.background}
              strokeWidth={GLYPH_STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {SPLIT_GLYPH_PATHS.map((path) => (
                <path key={path} d={path} />
              ))}
            </svg>
          </div>
          <div style={{ fontSize: 34 }}>SettleMates</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, color: OG_COLORS.primary }}>{eyebrow}</div>
          <div
            style={{
              fontSize: isLongTitle ? 60 : 76,
              lineHeight: 1.08,
              letterSpacing: isLongTitle ? -1.5 : -2,
            }}
          >
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
          {example && (
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
              <span>{example.label}</span>
              <span style={{ color: OG_COLORS.primary }}>{example.amount}</span>
            </div>
          )}
        </div>
      </div>
    ),
    OG_IMAGE_SIZE,
  );
}
