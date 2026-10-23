import { computeSplit, splitEqually } from "@/domains/expenses/split";
import type { SplitMethod } from "./types";

const EXAMPLE_TOTAL_CENTS = 200000;
const EXAMPLE_NAMES = ["You", "Amit", "Priya"];
const EXAMPLE_PERCENTS = [50, 30, 20];
const EXAMPLE_EXACT_CENTS = [120000, 50000, 30000];

// Shares come from the same domain functions the calculator uses, so the examples can't drift.
const equalShares = splitEqually(EXAMPLE_TOTAL_CENTS, EXAMPLE_NAMES.length);
const percentShares = computeSplit(
  EXAMPLE_TOTAL_CENTS,
  EXAMPLE_PERCENTS.map((percent) => ({ mode: "percentage" as const, percent })),
).sharesCents;
const exactShares = computeSplit(
  EXAMPLE_TOTAL_CENTS,
  EXAMPLE_EXACT_CENTS.map((cents) => ({ mode: "exact" as const, cents })),
).sharesCents;

export const SPLIT_METHODS: SplitMethod[] = [
  {
    title: "Split equally",
    description:
      "Everyone pays the same share. Best for a shared meal, a cab, or anything the whole group used equally.",
    exampleCaption: "₹2,000 dinner, split equally between 3",
    exampleShares: EXAMPLE_NAMES.map((name, index) => ({
      name,
      cents: equalShares[index],
    })),
    note: "₹2,000 doesn't divide evenly by 3, so the extra paisa go to the first people in the list.",
  },
  {
    title: "Split by percentage",
    description:
      "Give each person a share of 100%. Useful when one person ordered more, or for rent split by room size.",
    exampleCaption: "₹2,000 dinner, split 50% / 30% / 20%",
    exampleShares: EXAMPLE_NAMES.map((name, index) => ({
      name,
      detail: `${EXAMPLE_PERCENTS[index]}%`,
      cents: percentShares[index],
    })),
  },
  {
    title: "Split by exact amounts",
    description:
      "Enter exactly what each person owes. The calculator shows what's still unassigned until the shares match the bill.",
    exampleCaption: "₹2,000 dinner, split by what each person ordered",
    exampleShares: EXAMPLE_NAMES.map((name, index) => ({
      name,
      cents: exactShares[index],
    })),
  },
];
