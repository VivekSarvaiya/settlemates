import type { Feature } from "../../types";
import type { BentoTileTone } from "../BentoTile/types";

export interface TileHeaderProps {
  id: string;
  feature: Feature;
  tone?: BentoTileTone;
}
