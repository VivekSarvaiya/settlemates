import { displayName } from "@/components/shared/SplitCalculator/displayName";
import { isYou as isNamedYou } from "@/components/shared/SplitCalculator/phrases";
import { useSplitCalculator } from "@/components/shared/SplitCalculator/useSplitCalculator";
import type { SettlementTransaction } from "@/domains/settlement/settle";
import { formatCents } from "@/lib/currency";
import { DEFAULT_HEADLINE, SQUARE_HEADLINE } from "./const";
import type { HeroHeadline } from "./types";

export const useHero = () => {
  const calculator = useSplitCalculator();
  const { participants, settlements, canSubmit } = calculator;

  const nameAt = (index: number) =>
    displayName(participants[index]?.name ?? "", index);
  const isYou = (index: number) => isNamedYou(nameAt(index));

  const pickLargest = (transactions: SettlementTransaction[]) =>
    transactions.reduce<SettlementTransaction | null>(
      (largest, transaction) =>
        !largest || transaction.amountCents > largest.amountCents
          ? transaction
          : largest,
      null,
    );

  const getHeadline = (): HeroHeadline => {
    if (!canSubmit) return DEFAULT_HEADLINE;

    // Lead with the payment the visitor is part of, so the answer reads as theirs.
    const featured =
      pickLargest(
        settlements.filter(
          ({ fromIndex, toIndex }) => isYou(fromIndex) || isYou(toIndex),
        ),
      ) ?? pickLargest(settlements);
    if (!featured) return SQUARE_HEADLINE;

    const { fromIndex, toIndex, amountCents } = featured;
    const before = isYou(fromIndex)
      ? `You owe ${nameAt(toIndex)} `
      : `${nameAt(fromIndex)} owes ${isYou(toIndex) ? "you" : nameAt(toIndex)} `;
    const remaining = settlements.length - 1;

    return {
      key: `${fromIndex}-${toIndex}`,
      before,
      amount: formatCents(amountCents),
      detail:
        remaining === 0
          ? "That's the only payment needed to settle up."
          : `Plus ${remaining} more ${remaining === 1 ? "payment" : "payments"} to settle everyone up.`,
    };
  };

  return { calculator, headline: getHeadline() };
};
