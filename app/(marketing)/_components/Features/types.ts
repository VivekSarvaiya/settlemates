import type { LucideIcon } from "lucide-react";

export type FeatureId = "settlement" | "paisa" | "shareLink" | "chat";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}
