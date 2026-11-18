import type { ReactNode } from "react";

export type CalloutVariant = "note" | "tip" | "warning";

export interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children?: ReactNode;
}
