import { ImageResponse } from "next/og";
import { OG_COLORS } from "../OgImage/const";
import {
  CORNER_RADIUS_SCALE,
  GLYPH_SCALE,
  GLYPH_STROKE_WIDTH,
  SPLIT_GLYPH_PATHS,
} from "./const";
import type { AppIconOptions } from "./types";

// Full bleed for the Apple icon, which iOS masks itself; rounded like the Logo everywhere else.
export function renderAppIcon({ size, isFullBleed = false }: AppIconOptions) {
  const glyphSize = size * GLYPH_SCALE;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: OG_COLORS.foreground,
          borderRadius: isFullBleed ? 0 : size * CORNER_RADIUS_SCALE,
        }}
      >
        <svg
          width={glyphSize}
          height={glyphSize}
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
    ),
    { width: size, height: size },
  );
}
