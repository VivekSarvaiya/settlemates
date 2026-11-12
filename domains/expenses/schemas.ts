import { z } from "zod";
import type { SplitInput } from "./split";

/**
 * Boundary validation for split input. The domain engine still owns the rules —
 * these schemas exist so API route handlers can reject bad payloads before any
 * money math runs. Keep the two in sync.
 */

const totalCentsSchema = z
  .number()
  .int()
  .positive("Total must be a positive whole number of minor units.");

const minorUnitsSchema = z
  .number()
  .int()
  .nonnegative("Amounts must be zero or more whole minor units.");

const payerIndexSchema = z.number().int().nonnegative().optional();

function isWholeBasisPoints(value: number): boolean {
  const scaled = value * 100;
  return Math.abs(scaled - Math.round(scaled)) <= 1e-6;
}

const percentageSchema = z
  .number()
  .min(0, "Percentages cannot be negative.")
  .max(100, "Percentages cannot exceed 100.")
  .refine(isWholeBasisPoints, {
    message: "Percentages support at most two decimal places.",
  });

const equalSplitSchema = z.object({
  mode: z.literal("equal"),
  totalCents: totalCentsSchema,
  participantCount: z
    .number()
    .int()
    .positive("At least one participant is required."),
  payerIndex: payerIndexSchema,
});

const exactSplitSchema = z
  .object({
    mode: z.literal("exact"),
    totalCents: totalCentsSchema,
    amountsCents: z
      .array(minorUnitsSchema)
      .min(1, "At least one participant is required."),
    payerIndex: payerIndexSchema,
  })
  .superRefine((input, ctx) => {
    const total = BigInt(input.totalCents);
    const entered = input.amountsCents.reduce(
      (sum, amount) => sum + BigInt(amount),
      BigInt(0),
    );

    if (entered !== total) {
      ctx.addIssue({
        code: "custom",
        path: ["amountsCents"],
        message: "Exact amounts must add up to the total.",
      });
    }
  });

const percentageSplitSchema = z
  .object({
    mode: z.literal("percentage"),
    totalCents: totalCentsSchema,
    percentages: z
      .array(percentageSchema)
      .min(1, "At least one participant is required."),
    payerIndex: payerIndexSchema,
  })
  .superRefine((input, ctx) => {
    const totalBasisPoints = input.percentages.reduce(
      (sum, percentage) => sum + Math.round(percentage * 100),
      0,
    );

    if (totalBasisPoints !== 10_000) {
      ctx.addIssue({
        code: "custom",
        path: ["percentages"],
        message: "Percentages must add up to exactly 100.",
      });
    }
  });

const sharesSplitSchema = z
  .object({
    mode: z.literal("shares"),
    totalCents: totalCentsSchema,
    weights: z
      .array(minorUnitsSchema)
      .min(1, "At least one participant is required."),
    payerIndex: payerIndexSchema,
  })
  .superRefine((input, ctx) => {
    if (input.weights.every((weight) => weight === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["weights"],
        message: "At least one share weight must be greater than zero.",
      });
    }
  });

function countRows(input: SplitInput): number {
  switch (input.mode) {
    case "equal":
      return input.participantCount;
    case "exact":
      return input.amountsCents.length;
    case "percentage":
      return input.percentages.length;
    case "shares":
      return input.weights.length;
  }
}

export const splitInputSchema = z
  .union([
    equalSplitSchema,
    exactSplitSchema,
    percentageSplitSchema,
    sharesSplitSchema,
  ])
  .superRefine((input, ctx) => {
    const payerIndex = input.payerIndex ?? 0;
    if (payerIndex >= countRows(input)) {
      ctx.addIssue({
        code: "custom",
        path: ["payerIndex"],
        message: "Payer index must point at a participant.",
      });
    }
  });

type AssertAssignable<T extends U, U> = T;

export type SplitInputValues = AssertAssignable<
  z.output<typeof splitInputSchema>,
  SplitInput
>;
