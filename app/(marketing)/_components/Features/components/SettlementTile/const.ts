import type { BalanceTone, PaymentRowState } from "./types";

export const GRAPH_CENTER = 50;
export const NODE_RADIUS = 33;
export const NAME_RADIUS = 46;
export const EDGE_NODE_GAP = 7.5;
export const EDGE_BEND = 0.16;

export const AVATAR_TONE_CLASSES: Record<BalanceTone, string> = {
  credit: "border-primary bg-primary text-primary-foreground",
  debit: "border-border bg-background text-foreground",
  square: "border-border bg-muted text-muted-foreground",
};

export const PAYMENT_ROW_CLASSES: Record<PaymentRowState, string> = {
  idle: "border-border bg-background",
  active: "border-primary/40 bg-primary/5",
  dimmed: "border-border bg-background text-muted-foreground",
};

export const READOUT_HINT = "Hover or tap anyone to trace their money.";
