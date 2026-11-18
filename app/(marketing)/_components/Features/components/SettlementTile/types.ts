import type { DemoGroup } from "../BentoGrid/types";

export interface SettlementTileProps {
  group: DemoGroup;
  peopleCount: number;
  minPeople: number;
  maxPeople: number;
  onAddPerson: () => void;
  onRemovePerson: () => void;
  onShuffle: () => void;
}

export interface UseSettlementTileParams {
  group: DemoGroup;
}

export type Highlight =
  | { kind: "person"; index: number }
  | { kind: "payment"; key: string };

export type BalanceTone = "credit" | "debit" | "square";

export interface Point {
  x: number;
  y: number;
}

export type PaymentRowState = "idle" | "active" | "dimmed";

export interface GraphNode {
  key: string;
  name: string;
  initial: string;
  tone: BalanceTone;
  point: Point;
  namePoint: Point;
  isActive: boolean;
  isSelected: boolean;
}

export interface GraphEdge {
  key: string;
  amountLabel: string;
  isActive: boolean;
  path: string;
  labelPoint: Point;
}

export interface PaymentRow {
  key: string;
  label: string;
  amountLabel: string;
  state: PaymentRowState;
}
