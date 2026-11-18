import { isYou } from "@/components/shared/SplitCalculator/phrases";
import { formatCents } from "@/lib/currency";
import type { DemoPerson } from "../BentoGrid/types";
import {
  EDGE_BEND,
  EDGE_NODE_GAP,
  GRAPH_CENTER,
  NAME_RADIUS,
  NODE_RADIUS,
} from "./const";
import type { BalanceTone, Point } from "./types";

// Positions are in a 0–100 box, so they work both as SVG coordinates and as CSS percentages.
const pointOnCircle = (index: number, count: number, radius: number): Point => {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
  return {
    x: GRAPH_CENTER + radius * Math.cos(angle),
    y: GRAPH_CENTER + radius * Math.sin(angle),
  };
};

export const getNodePoint = (index: number, count: number) =>
  pointOnCircle(index, count, NODE_RADIUS);

export const getNamePoint = (index: number, count: number) =>
  pointOnCircle(index, count, NAME_RADIUS);

export const getEdgeGeometry = (from: Point, to: Point) => {
  const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  const unitX = (to.x - from.x) / length;
  const unitY = (to.y - from.y) / length;
  const start = { x: from.x + unitX * EDGE_NODE_GAP, y: from.y + unitY * EDGE_NODE_GAP };
  const end = { x: to.x - unitX * EDGE_NODE_GAP, y: to.y - unitY * EDGE_NODE_GAP };
  const control = {
    x: (start.x + end.x) / 2 - unitY * length * EDGE_BEND,
    y: (start.y + end.y) / 2 + unitX * length * EDGE_BEND,
  };

  return {
    path: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`,
    labelPoint: {
      x: 0.25 * start.x + 0.5 * control.x + 0.25 * end.x,
      y: 0.25 * start.y + 0.5 * control.y + 0.25 * end.y,
    },
  };
};

export const getBalanceTone = (balanceCents: number): BalanceTone => {
  if (balanceCents > 0) return "credit";
  if (balanceCents < 0) return "debit";
  return "square";
};

export const describePerson = (person: DemoPerson) => {
  const you = isYou(person.name);
  const paid = `${person.name} paid ${formatCents(person.paidCents)}`;

  if (person.balanceCents > 0) {
    return `${paid} and ${you ? "get" : "gets"} back ${formatCents(person.balanceCents)}.`;
  }
  if (person.balanceCents < 0) {
    return `${paid} and ${you ? "owe" : "owes"} ${formatCents(-person.balanceCents)}.`;
  }
  return `${paid}, exactly ${you ? "your" : "their"} share.`;
};
