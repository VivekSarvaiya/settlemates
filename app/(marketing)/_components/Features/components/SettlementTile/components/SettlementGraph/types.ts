import type { PointerEvent, RefObject } from "react";
import type { GraphEdge, GraphNode } from "../../types";

export interface SettlementGraphProps {
  graphRef: RefObject<HTMLDivElement | null>;
  markerId: string;
  isInView: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
  onPersonPointerEnter: (index: number, event: PointerEvent) => void;
  onPersonPointerUp: (index: number, event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
}
