"use client";

import { cn } from "cn";
import { TILE_TONE_CLASSES } from "./const";
import type { BentoTileProps } from "./types";
import { useBentoTile } from "./useBentoTile";

export function BentoTile({
  labelledBy,
  tone = "default",
  className,
  children,
}: BentoTileProps) {
  const { handlePointerMove } = useBentoTile();

  return (
    <article
      aria-labelledby={labelledBy}
      onPointerMove={handlePointerMove}
      className={cn(
        "group/tile relative isolate flex h-full flex-col gap-6 overflow-hidden rounded-xl border p-6 transition-colors duration-300 md:p-8",
        TILE_TONE_CLASSES[tone],
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(28rem_circle_at_var(--spot-x,50%)_var(--spot-y,0%),var(--spot),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
      />
      {children}
    </article>
  );
}
