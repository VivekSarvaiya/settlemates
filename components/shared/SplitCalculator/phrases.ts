import { formatCents } from "@/lib/currency";
import type { BalanceLabel } from "./types";

export function isYou(name: string): boolean {
  return name.trim().toLowerCase() === "you";
}

/** "Kabir pays you" / "You pay Amit" — keeps the verb right when someone is named "You". */
export function describePayment(fromName: string, toName: string): string {
  const verb = isYou(fromName) ? "pay" : "pays";
  return `${fromName} ${verb} ${isYou(toName) ? "you" : toName}`;
}

export function describeBalance(balanceCents: number): BalanceLabel {
  if (balanceCents > 0) {
    return { tone: "credit", text: `gets back ${formatCents(balanceCents)}` };
  }
  if (balanceCents < 0) {
    return { tone: "debit", text: `owes ${formatCents(-balanceCents)}` };
  }
  return { tone: "square", text: "all square" };
}
