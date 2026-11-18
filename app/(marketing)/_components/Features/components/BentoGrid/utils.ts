import { DEFAULT_NAMES } from "@/components/shared/SplitCalculator/const";
import { describePayment } from "@/components/shared/SplitCalculator/phrases";
import { summarizeEqualSplit } from "@/domains/expenses/split";
import { computeSettlement } from "@/domains/settlement/settle";
import {
  SHUFFLE_MAX_STEPS,
  SHUFFLE_STEP_CENTS,
  SHUFFLE_ZERO_CHANCE,
} from "./const";
import type { DemoGroup } from "./types";

const nameAt = (index: number) => DEFAULT_NAMES[index] ?? `Person ${index + 1}`;

// Runs the real split and settlement engines, so the demo can never disagree with the calculator.
export const buildDemoGroup = (paidCents: readonly number[]): DemoGroup => {
  const totalCents = paidCents.reduce((sum, cents) => sum + cents, 0);
  const { sharesCents, baseShareCents } = summarizeEqualSplit(
    totalCents,
    paidCents.length,
  );
  const settlement = computeSettlement(paidCents, sharesCents);

  return {
    people: paidCents.map((cents, index) => ({
      name: nameAt(index),
      paidCents: cents,
      balanceCents: cents - (sharesCents[index] ?? 0),
    })),
    totalCents,
    shareCents: baseShareCents,
    payments: settlement.ok
      ? settlement.transactions.map(({ fromIndex, toIndex, amountCents }) => ({
          key: `${fromIndex}-${toIndex}`,
          fromIndex,
          toIndex,
          amountCents,
          label: describePayment(nameAt(fromIndex), nameAt(toIndex)),
        }))
      : [],
  };
};

// The first person always paid something, so every group the demo can show has a total to split.
export const shufflePaidCents = (count: number) =>
  Array.from({ length: count }, (_, index) =>
    index > 0 && Math.random() < SHUFFLE_ZERO_CHANCE
      ? 0
      : (1 + Math.floor(Math.random() * SHUFFLE_MAX_STEPS)) * SHUFFLE_STEP_CENTS,
  );
