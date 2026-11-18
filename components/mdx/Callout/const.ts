import { Info, Lightbulb, TriangleAlert } from "lucide-react";

export const CALLOUT_VARIANTS = {
  note: { icon: Info, label: "Note", iconClassName: "text-muted-foreground" },
  tip: { icon: Lightbulb, label: "Tip", iconClassName: "text-muted-foreground" },
  warning: { icon: TriangleAlert, label: "Watch out", iconClassName: "text-destructive" },
} as const;
