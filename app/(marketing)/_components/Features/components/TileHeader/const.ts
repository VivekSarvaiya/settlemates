import type { BentoTileTone } from "../BentoTile/types";

export const HEADER_TONE_CLASSES: Record<
  BentoTileTone,
  { badge: string; icon: string; description: string }
> = {
  default: {
    badge: "bg-primary/10",
    icon: "text-primary-text",
    description: "text-muted-foreground",
  },
  inverse: {
    badge: "bg-primary",
    icon: "text-primary-foreground",
    description: "text-inverse-foreground/70",
  },
};
