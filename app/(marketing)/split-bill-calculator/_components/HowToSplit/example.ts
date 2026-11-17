import { describeBalance, describePayment } from "@/components/shared/SplitCalculator/phrases";
import { summarizeEqualSplit } from "@/domains/expenses/split";
import { computeSettlement } from "@/domains/settlement/settle";
import { EXAMPLE_PEOPLE } from "./const";

// Runs the real engines, so the worked example always matches the calculator.
export function buildExample() {
  const paidCents = EXAMPLE_PEOPLE.map((person) => person.paidCents);
  const totalCents = paidCents.reduce((sum, cents) => sum + cents, 0);
  const { sharesCents, baseShareCents } = summarizeEqualSplit(
    totalCents,
    EXAMPLE_PEOPLE.length,
  );
  const settlement = computeSettlement(paidCents, sharesCents);
  const transactions = settlement.ok ? settlement.transactions : [];

  return {
    totalCents,
    shareCents: baseShareCents,
    rows: EXAMPLE_PEOPLE.map((person, index) => ({
      name: person.name,
      paidCents: person.paidCents,
      balance: describeBalance(person.paidCents - (sharesCents[index] ?? 0)),
    })),
    payments: transactions.map((transaction) => ({
      key: `${transaction.fromIndex}-${transaction.toIndex}`,
      label: describePayment(
        EXAMPLE_PEOPLE[transaction.fromIndex]?.name ?? "",
        EXAMPLE_PEOPLE[transaction.toIndex]?.name ?? "",
      ),
      amountCents: transaction.amountCents,
    })),
  };
}
