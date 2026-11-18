import type { ReactNode } from "react";

export type BentoTileTone = "default" | "inverse";

export interface BentoTileProps {
  labelledBy: string;
  tone?: BentoTileTone;
  className?: string;
  children: ReactNode;
}
