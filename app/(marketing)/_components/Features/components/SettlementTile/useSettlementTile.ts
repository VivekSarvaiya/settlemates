import { useInView } from "motion/react";
import { type PointerEvent, useId, useRef, useState } from "react";
import { formatCents } from "@/lib/currency";
import type { DemoPayment } from "../BentoGrid/types";
import { READOUT_HINT } from "./const";
import type {
  GraphEdge,
  GraphNode,
  Highlight,
  PaymentRow,
  PaymentRowState,
  UseSettlementTileParams,
} from "./types";
import {
  describePerson,
  getBalanceTone,
  getEdgeGeometry,
  getNamePoint,
  getNodePoint,
} from "./utils";

const isMouse = (event: PointerEvent) => event.pointerType === "mouse";

export const useSettlementTile = ({ group }: UseSettlementTileParams) => {
  const titleId = useId();
  // SVG url(#id) references need a plain id, and useId output can contain other characters.
  const markerId = `arrow${useId().replace(/[^\w-]/g, "")}`;
  const graphRef = useRef<HTMLDivElement>(null);
  const isGraphInView = useInView(graphRef, { once: true, margin: "0px 0px -15% 0px" });
  const [highlight, setHighlight] = useState<Highlight | null>(null);

  const { people, payments, totalCents } = group;
  const count = people.length;

  // A highlight can outlive the person or payment it pointed at once the group changes.
  const personIndex =
    highlight?.kind === "person" && highlight.index < count ? highlight.index : null;
  const highlightedPayment =
    highlight?.kind === "payment"
      ? payments.find((payment) => payment.key === highlight.key)
      : undefined;
  const hasHighlight = personIndex !== null || highlightedPayment !== undefined;

  const isPaymentActive = (payment: DemoPayment) => {
    if (highlightedPayment) return payment.key === highlightedPayment.key;
    if (personIndex !== null) {
      return payment.fromIndex === personIndex || payment.toIndex === personIndex;
    }
    return true;
  };

  const isPersonActive = (index: number) =>
    !hasHighlight ||
    index === personIndex ||
    payments.some(
      (payment) =>
        isPaymentActive(payment) &&
        (payment.fromIndex === index || payment.toIndex === index),
    );

  // Edges re-draw whenever the group changes, so every recalculation is visible.
  const graphKey = people.map((person) => person.paidCents).join("-");

  const getRowState = (payment: DemoPayment): PaymentRowState => {
    if (!hasHighlight) return "idle";
    return isPaymentActive(payment) ? "active" : "dimmed";
  };

  const nodes: GraphNode[] = people.map((person, index) => ({
    key: person.name,
    name: person.name,
    initial: person.name.charAt(0).toUpperCase(),
    tone: getBalanceTone(person.balanceCents),
    point: getNodePoint(index, count),
    namePoint: getNamePoint(index, count),
    isActive: isPersonActive(index),
    isSelected: index === personIndex,
  }));

  const edges: GraphEdge[] = payments.map((payment) => ({
    key: `${graphKey}:${payment.key}`,
    amountLabel: formatCents(payment.amountCents),
    isActive: isPaymentActive(payment),
    ...getEdgeGeometry(
      getNodePoint(payment.fromIndex, count),
      getNodePoint(payment.toIndex, count),
    ),
  }));

  const paymentRows: PaymentRow[] = payments.map((payment) => ({
    key: payment.key,
    label: payment.label,
    amountLabel: formatCents(payment.amountCents),
    state: getRowState(payment),
  }));

  let readout = READOUT_HINT;
  if (highlightedPayment) {
    readout = `${highlightedPayment.label} ${formatCents(highlightedPayment.amountCents)}.`;
  } else if (personIndex !== null) {
    readout = describePerson(people[personIndex]);
  }

  const headline =
    payments.length === 0
      ? "All square"
      : `${payments.length} ${payments.length === 1 ? "payment" : "payments"}`;
  const summary =
    payments.length === 0
      ? "Everyone paid the same, so nobody owes anything."
      : `settle ${formatCents(totalCents)} between ${count} people. Never more than ${count - 1}.`;

  const handlePersonPointerEnter = (index: number, event: PointerEvent) => {
    if (isMouse(event)) setHighlight({ kind: "person", index });
  };
  const handlePaymentPointerEnter = (key: string, event: PointerEvent) => {
    if (isMouse(event)) setHighlight({ kind: "payment", key });
  };
  const handlePointerLeave = (event: PointerEvent) => {
    if (isMouse(event)) setHighlight(null);
  };
  // Touch has no hover, so a tap toggles the same highlight instead.
  const handlePersonPointerUp = (index: number, event: PointerEvent) => {
    if (isMouse(event)) return;
    setHighlight((current) =>
      current?.kind === "person" && current.index === index
        ? null
        : { kind: "person", index },
    );
  };
  const handlePaymentPointerUp = (key: string, event: PointerEvent) => {
    if (isMouse(event)) return;
    setHighlight((current) =>
      current?.kind === "payment" && current.key === key
        ? null
        : { kind: "payment", key },
    );
  };

  return {
    titleId,
    markerId,
    graphRef,
    isGraphInView,
    nodes,
    edges,
    paymentRows,
    readout,
    headline,
    summary,
    handlePersonPointerEnter,
    handlePaymentPointerEnter,
    handlePointerLeave,
    handlePersonPointerUp,
    handlePaymentPointerUp,
  };
};
