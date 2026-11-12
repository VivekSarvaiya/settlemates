import { describe, expect, it } from "vitest";
import { splitInputSchema } from "@/domains/expenses/schemas";

describe("splitInputSchema", () => {
  it("accepts a valid equal split", () => {
    const parsed = splitInputSchema.parse({
      mode: "equal",
      totalCents: 10_000,
      participantCount: 3,
    });

    expect(parsed).toEqual({
      mode: "equal",
      totalCents: 10_000,
      participantCount: 3,
    });
  });

  it("accepts exact, percentage, and shares splits that agree", () => {
    expect(
      splitInputSchema.safeParse({
        mode: "exact",
        totalCents: 2000,
        amountsCents: [500, 1500],
      }).success,
    ).toBe(true);
    expect(
      splitInputSchema.safeParse({
        mode: "percentage",
        totalCents: 2000,
        percentages: [33.33, 33.33, 33.34],
      }).success,
    ).toBe(true);
    expect(
      splitInputSchema.safeParse({
        mode: "shares",
        totalCents: 2000,
        weights: [2, 1, 1],
        payerIndex: 1,
      }).success,
    ).toBe(true);
  });

  it("rejects totals that are not positive whole minor units", () => {
    expect(
      splitInputSchema.safeParse({
        mode: "equal",
        totalCents: 0,
        participantCount: 2,
      }).success,
    ).toBe(false);
    expect(
      splitInputSchema.safeParse({
        mode: "equal",
        totalCents: 10.5,
        participantCount: 2,
      }).success,
    ).toBe(false);
  });

  it("rejects exact amounts that do not add up to the total", () => {
    const result = splitInputSchema.safeParse({
      mode: "exact",
      totalCents: 2000,
      amountsCents: [500, 500],
    });

    expect(result.success).toBe(false);
  });

  it("rejects percentages that do not add up to 100", () => {
    expect(
      splitInputSchema.safeParse({
        mode: "percentage",
        totalCents: 2000,
        percentages: [50, 40],
      }).success,
    ).toBe(false);
  });

  it("rejects percentages with more than two decimals", () => {
    expect(
      splitInputSchema.safeParse({
        mode: "percentage",
        totalCents: 2000,
        percentages: [33.333, 66.667],
      }).success,
    ).toBe(false);
  });

  it("rejects share lists without a positive weight", () => {
    expect(
      splitInputSchema.safeParse({
        mode: "shares",
        totalCents: 2000,
        weights: [0, 0],
      }).success,
    ).toBe(false);
  });

  it("rejects an empty participant list", () => {
    expect(
      splitInputSchema.safeParse({ mode: "exact", totalCents: 2000, amountsCents: [] })
        .success,
    ).toBe(false);
    expect(
      splitInputSchema.safeParse({ mode: "percentage", totalCents: 2000, percentages: [] })
        .success,
    ).toBe(false);
    expect(
      splitInputSchema.safeParse({ mode: "shares", totalCents: 2000, weights: [] })
        .success,
    ).toBe(false);
  });

  it("rejects a payer index outside the participant list", () => {
    expect(
      splitInputSchema.safeParse({
        mode: "equal",
        totalCents: 2000,
        participantCount: 2,
        payerIndex: 2,
      }).success,
    ).toBe(false);
    expect(
      splitInputSchema.safeParse({
        mode: "shares",
        totalCents: 2000,
        weights: [1, 1],
        payerIndex: 2,
      }).success,
    ).toBe(false);
  });
});
