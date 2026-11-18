import { formatCents } from "@/lib/currency";
import { describeBalance, describePayment } from "./phrases";
import type { ShareMessageInput } from "./types";

export function buildShareMessage({
  names,
  paidCents,
  balancesCents,
  transactions,
  totalCents,
  shareCents,
  link,
}: ShareMessageInput): string {
  const nameAt = (index: number) => names[index] ?? "";
  const rows = names.map(
    (name, index) =>
      `${name} paid ${formatCents(paidCents[index] ?? 0)} · ${describeBalance(balancesCents[index] ?? 0).text}`,
  );
  const payments =
    transactions.length > 0
      ? [
          "Who pays whom",
          ...transactions.map(
            (transaction) =>
              `${describePayment(nameAt(transaction.fromIndex), nameAt(transaction.toIndex))} ${formatCents(transaction.amountCents)}`,
          ),
        ]
      : ["Everyone's square — no payments needed."];

  return [
    `${formatCents(totalCents)} split between ${names.length} ${
      names.length === 1 ? "person" : "people"
    }`,
    `Each person's share: ${formatCents(shareCents)}`,
    "",
    ...rows,
    "",
    ...payments,
    "",
    `Open this split on SettleMates: ${link}`,
  ].join("\n");
}
