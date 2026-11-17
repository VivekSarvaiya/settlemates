"use client";

import { formatCents } from "@/lib/currency";
import { displayName } from "../../displayName";
import { describePayment } from "../../phrases";
import type { SettlementListProps } from "../../types";

export function SettlementList({
  participants,
  transactions,
}: SettlementListProps) {
  if (transactions.length === 0) return null;

  return (
    <section aria-label="Who pays whom" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-medium">Who pays whom</h3>
        <span className="text-sm text-muted-foreground">
          {transactions.length}{" "}
          {transactions.length === 1 ? "payment" : "payments"}
        </span>
      </div>

      <ul aria-label="Payments" className="flex flex-col gap-2">
        {transactions.map((transaction) => {
          const fromName = displayName(
            participants[transaction.fromIndex]?.name ?? "",
            transaction.fromIndex,
          );
          const toName = displayName(
            participants[transaction.toIndex]?.name ?? "",
            transaction.toIndex,
          );

          return (
            <li
              key={`${transaction.fromIndex}-${transaction.toIndex}-${transaction.amountCents}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5"
            >
              <span className="min-w-0 flex-1 truncate text-base">
                {describePayment(fromName, toName)}
              </span>
              <span className="shrink-0 text-base font-medium tabular-nums">
                {formatCents(transaction.amountCents)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
