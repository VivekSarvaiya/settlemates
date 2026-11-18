import type { BentoTileTone } from "./types";

export const TILE_TONE_CLASSES: Record<BentoTileTone, string> = {
  default:
    "border-border bg-background [--spot:color-mix(in_oklch,var(--primary)_9%,transparent)] hover:border-primary/30",
  inverse:
    "border-inverse bg-inverse text-inverse-foreground [--spot:color-mix(in_oklch,var(--primary)_45%,transparent)]",
};
