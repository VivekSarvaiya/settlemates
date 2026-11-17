import { describePayment } from "@/components/shared/SplitCalculator/phrases";
import { summarizeEqualSplit } from "@/domains/expenses/split";
import { computeSettlement } from "@/domains/settlement/settle";
import { EXAMPLE_PEOPLE, NUMBER_WORDS } from "./const";

const toWord = (count: number) => NUMBER_WORDS[count] ?? String(count);

// Runs the real split and settlement engines, so the example can never drift from the calculator.
export function buildExample() {
  const paidCents = EXAMPLE_PEOPLE.map((person) => person.paidCents);
  const totalCents = paidCents.reduce((sum, cents) => sum + cents, 0);
  const { sharesCents, baseShareCents } = summarizeEqualSplit(
    totalCents,
    EXAMPLE_PEOPLE.length,
  );
  const settlement = computeSettlement(paidCents, sharesCents);
  const transactions = settlement.ok ? settlement.transactions : [];
  const squareNames = EXAMPLE_PEOPLE.filter(
    (person, index) => person.paidCents === sharesCents[index],
  ).map((person) => person.name);

  return {
    people: EXAMPLE_PEOPLE,
    totalCents,
    shareCents: baseShareCents,
    payments: transactions.map((transaction) => ({
      key: `${transaction.fromIndex}-${transaction.toIndex}`,
      label: describePayment(
        EXAMPLE_PEOPLE[transaction.fromIndex]?.name ?? "",
        EXAMPLE_PEOPLE[transaction.toIndex]?.name ?? "",
      ),
      amountCents: transaction.amountCents,
    })),
    squareNames,
    peopleWord: toWord(EXAMPLE_PEOPLE.length),
    paymentsWord: toWord(transactions.length),
    paymentsWordLower: toWord(transactions.length).toLowerCase(),
    paymentsNoun: transactions.length === 1 ? "payment" : "payments",
    squareVerb: squareNames.length === 1 ? "has" : "have",
  };
}
