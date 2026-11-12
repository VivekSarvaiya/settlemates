import { describe, expect, it } from "vitest";
import {
  computeSplit,
  parsePercentInput,
  splitEqually,
  summarizeEqualSplit,
  type SplitResult,
} from "@/domains/expenses/split";

function expectOk(result: SplitResult): number[] {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`Expected a split, got ${result.error.code}`);
  return result.sharesCents;
}

function expectError(result: SplitResult): Extract<SplitResult, { ok: false }>["error"] {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected the split to be rejected");
  return result.error;
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

describe("summarizeEqualSplit", () => {
  it("gives the leftover paisa to the payer first, then in participant order", () => {
    const summary = summarizeEqualSplit(10_000, 3, 0);

    expect(summary.sharesCents).toEqual([3334, 3333, 3333]);
    expect(summary.baseShareCents).toBe(3333);
    expect(summary.baseSharePercent).toBe(33.3);
    expect(summary.remainderCents).toBe(1);
    expect(summary.remainderRecipientIndexes).toEqual([0]);
  });

  it("rotates leftover recipients after the payer", () => {
    const summary = summarizeEqualSplit(9999, 4, 1);

    expect(summary.baseShareCents).toBe(2499);
    expect(summary.remainderCents).toBe(3);
    expect(summary.remainderRecipientIndexes).toEqual([1, 2, 3]);
    expect(summary.sharesCents).toEqual([2499, 2500, 2500, 2500]);
  });

  it("splits a single minor unit without losing it", () => {
    expect(summarizeEqualSplit(1, 3, 2).sharesCents).toEqual([0, 0, 1]);
    expect(summarizeEqualSplit(1, 3, 0).remainderRecipientIndexes).toEqual([0]);
  });

  it("gives one participant the whole total", () => {
    const summary = summarizeEqualSplit(12_345, 1);

    expect(summary.sharesCents).toEqual([12_345]);
    expect(summary.baseSharePercent).toBe(100);
    expect(summary.remainderCents).toBe(0);
    expect(summary.remainderRecipientIndexes).toEqual([]);
  });

  it("keeps large totals exact", () => {
    const total = Number.MAX_SAFE_INTEGER;
    const summary = summarizeEqualSplit(total, 3);

    expect(summary.sharesCents).toHaveLength(3);
    expect(summary.sharesCents.every(Number.isSafeInteger)).toBe(true);
    expect(sum(summary.sharesCents)).toBe(total);
  });

  it("rejects invalid totals, participant counts, and payer indexes", () => {
    const empty = {
      sharesCents: [],
      baseShareCents: 0,
      baseSharePercent: 0,
      remainderCents: 0,
      remainderRecipientIndexes: [],
    };

    expect(summarizeEqualSplit(-1, 3)).toEqual(empty);
    expect(summarizeEqualSplit(10.5, 3)).toEqual(empty);
    expect(summarizeEqualSplit(100, 0)).toEqual(empty);
    expect(summarizeEqualSplit(100, 1.5)).toEqual(empty);
    expect(summarizeEqualSplit(100, 3, -1)).toEqual(empty);
    expect(summarizeEqualSplit(100, 3, 3)).toEqual(empty);
  });

  it("is the same math that splitEqually exposes", () => {
    expect(splitEqually(100, 3, 1)).toEqual(
      summarizeEqualSplit(100, 3, 1).sharesCents,
    );
  });
});

describe("computeSplit: equal", () => {
  it("splits ₹100 three ways", () => {
    const result = computeSplit({
      mode: "equal",
      totalCents: 10_000,
      participantCount: 3,
    });

    expect(expectOk(result)).toEqual([3334, 3333, 3333]);
  });

  it("honours an explicit payer index", () => {
    const result = computeSplit({
      mode: "equal",
      totalCents: 10_000,
      participantCount: 3,
      payerIndex: 2,
    });

    expect(expectOk(result)).toEqual([3333, 3333, 3334]);
  });

  it("rejects non-positive and non-integer totals", () => {
    expect(
      expectError(
        computeSplit({ mode: "equal", totalCents: 0, participantCount: 2 }),
      ).code,
    ).toBe("invalid-total");
    expect(
      expectError(
        computeSplit({ mode: "equal", totalCents: -100, participantCount: 2 }),
      ).code,
    ).toBe("invalid-total");
    expect(
      expectError(
        computeSplit({ mode: "equal", totalCents: 10.5, participantCount: 2 }),
      ).code,
    ).toBe("invalid-total");
  });

  it("rejects zero participants and out-of-range payers", () => {
    expect(
      expectError(
        computeSplit({ mode: "equal", totalCents: 100, participantCount: 0 }),
      ).code,
    ).toBe("no-participants");
    expect(
      expectError(
        computeSplit({
          mode: "equal",
          totalCents: 100,
          participantCount: 2,
          payerIndex: 2,
        }),
      ).code,
    ).toBe("invalid-payer-index");
  });
});

describe("computeSplit: exact", () => {
  it("accepts amounts that add up to the total", () => {
    const result = computeSplit({
      mode: "exact",
      totalCents: 10_000,
      amountsCents: [3334, 3333, 3333],
    });

    expect(expectOk(result)).toEqual([3334, 3333, 3333]);
  });

  it("reports how much is still unassigned", () => {
    const error = expectError(
      computeSplit({ mode: "exact", totalCents: 2000, amountsCents: [1000] }),
    );

    expect(error.code).toBe("amount-mismatch");
    expect(error.differenceCents).toBe(1000);
  });

  it("reports how far over the total the amounts are", () => {
    const error = expectError(
      computeSplit({ mode: "exact", totalCents: 2000, amountsCents: [3000] }),
    );

    expect(error.code).toBe("amount-mismatch");
    expect(error.differenceCents).toBe(-1000);
  });

  it("flags a blank row once the visible amounts reconcile", () => {
    const result = computeSplit({
      mode: "exact",
      totalCents: 2000,
      amountsCents: [null, 2000],
    });
    const error = expectError(result);

    expect(error.code).toBe("invalid-amount");
    expect(error.rowIndex).toBe(0);
    expect(result.ok ? [] : result.previewSharesCents).toEqual([0, 2000]);
  });

  it("treats NaN as an invalid row, not as zero cents", () => {
    const error = expectError(
      computeSplit({
        mode: "exact",
        totalCents: 2000,
        amountsCents: [Number.NaN, 2000],
      }),
    );

    expect(error.code).toBe("invalid-amount");
    expect(error.rowIndex).toBe(0);
  });

  it("rejects an empty participant list or an out-of-range payer", () => {
    expect(
      expectError(
        computeSplit({ mode: "exact", totalCents: 100, amountsCents: [] }),
      ).code,
    ).toBe("no-participants");
    expect(
      expectError(
        computeSplit({
          mode: "exact",
          totalCents: 100,
          amountsCents: [100],
          payerIndex: 1,
        }),
      ).code,
    ).toBe("invalid-payer-index");
  });

  it("clamps an unbounded overflow in the difference", () => {
    const max = Number.MAX_SAFE_INTEGER;
    const error = expectError(
      computeSplit({
        mode: "exact",
        totalCents: max,
        amountsCents: [max, max, 1],
      }),
    );

    expect(error.code).toBe("amount-mismatch");
    expect(error.differenceCents).toBe(-max);
  });
});

describe("computeSplit: percentage", () => {
  it("converts percentages into exact minor units", () => {
    const result = computeSplit({
      mode: "percentage",
      totalCents: 200_000,
      percentages: [50, 30, 20],
    });

    expect(expectOk(result)).toEqual([100_000, 60_000, 40_000]);
  });

  it("supports two decimal places", () => {
    const result = computeSplit({
      mode: "percentage",
      totalCents: 10_000,
      percentages: [33.34, 33.33, 33.33],
    });

    expect(expectOk(result)).toEqual([3334, 3333, 3333]);
  });

  it("rejects percentages that do not reach 100", () => {
    const result = computeSplit({
      mode: "percentage",
      totalCents: 10_000,
      percentages: [33.33, 33.33, 33.33],
    });
    const error = expectError(result);

    expect(error.code).toBe("percentage-mismatch");
    expect(error.differenceCents).toBe(1);
    expect(result.ok ? [] : result.previewSharesCents).toEqual([3333, 3333, 3333]);
  });

  it("rejects percentages that exceed 100", () => {
    const error = expectError(
      computeSplit({
        mode: "percentage",
        totalCents: 10_000,
        percentages: [60, 50],
      }),
    );

    expect(error.code).toBe("percentage-mismatch");
    expect(error.differenceCents).toBe(-1000);
  });

  it("rounds the assigned pool before flagging a mismatch of less than a paisa", () => {
    const error = expectError(
      computeSplit({
        mode: "percentage",
        totalCents: 1,
        percentages: [33.33, 33.33, 33.33],
      }),
    );

    expect(error.code).toBe("percentage-mismatch");
    expect(error.differenceCents).toBe(0);
  });

  it("flags a blank row once the percentages reach 100", () => {
    const error = expectError(
      computeSplit({
        mode: "percentage",
        totalCents: 10_000,
        percentages: [50, 50, null],
      }),
    );

    expect(error.code).toBe("invalid-percentage");
    expect(error.rowIndex).toBe(2);
  });

  it("reports a blank list as the whole total being unassigned", () => {
    const result = computeSplit({
      mode: "percentage",
      totalCents: 10_000,
      percentages: [null, null],
    });
    const error = expectError(result);

    expect(error.code).toBe("percentage-mismatch");
    expect(error.differenceCents).toBe(10_000);
    expect(result.ok ? [] : result.previewSharesCents).toEqual([0, 0]);
  });

  it("rejects an empty participant list or an out-of-range payer", () => {
    expect(
      expectError(
        computeSplit({ mode: "percentage", totalCents: 100, percentages: [] }),
      ).code,
    ).toBe("no-participants");
    expect(
      expectError(
        computeSplit({
          mode: "percentage",
          totalCents: 100,
          percentages: [100],
          payerIndex: 2,
        }),
      ).code,
    ).toBe("invalid-payer-index");
  });
});

describe("computeSplit: shares", () => {
  it("normalizes weights into the total", () => {
    expect(
      expectOk(
        computeSplit({
          mode: "shares",
          totalCents: 600,
          weights: [1, 2, 3],
        }),
      ),
    ).toEqual([100, 200, 300]);
  });

  it("distributes leftover units by largest remainder, then row order", () => {
    expect(
      expectOk(
        computeSplit({
          mode: "shares",
          totalCents: 100,
          weights: [1, 1, 1],
        }),
      ),
    ).toEqual([34, 33, 33]);
  });

  it("allows a zero weight", () => {
    expect(
      expectOk(
        computeSplit({ mode: "shares", totalCents: 10, weights: [0, 1] }),
      ),
    ).toEqual([0, 10]);
  });

  it("rejects invalid weights", () => {
    const error = expectError(
      computeSplit({ mode: "shares", totalCents: 10, weights: [1, null] }),
    );

    expect(error.code).toBe("invalid-share");
    expect(error.rowIndex).toBe(1);
  });

  it("rejects a list with no positive weight", () => {
    const error = expectError(
      computeSplit({ mode: "shares", totalCents: 10, weights: [0, 0] }),
    );

    expect(error.code).toBe("no-shares");
  });

  it("rejects an empty participant list or an out-of-range payer", () => {
    expect(
      expectError(
        computeSplit({ mode: "shares", totalCents: 100, weights: [] }),
      ).code,
    ).toBe("no-participants");
    expect(
      expectError(
        computeSplit({
          mode: "shares",
          totalCents: 100,
          weights: [1],
          payerIndex: 1,
        }),
      ).code,
    ).toBe("invalid-payer-index");
  });
});

describe("split invariant", () => {
  const cases = [
    { mode: "equal", totalCents: 10_000, participantCount: 3 },
    { mode: "equal", totalCents: 1, participantCount: 3, payerIndex: 2 },
    { mode: "equal", totalCents: 99_999_999, participantCount: 7 },
    { mode: "exact", totalCents: 10_000, amountsCents: [2500, 2500, 5000] },
    { mode: "percentage", totalCents: 10_000, percentages: [50, 25, 25] },
    {
      mode: "percentage",
      totalCents: 999,
      percentages: [33.33, 33.33, 33.34],
    },
    { mode: "shares", totalCents: 1000, weights: [5, 3, 2] },
    { mode: "shares", totalCents: 7, weights: [1, 1, 1, 1, 1] },
  ] as const;

  it.each(cases)("always sums to the total: %o", (input) => {
    const result = computeSplit(input);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.sharesCents.every(Number.isSafeInteger)).toBe(true);
    expect(sum(result.sharesCents)).toBe(input.totalCents);
  });
});

describe("parsePercentInput", () => {
  it("accepts whole and two-decimal percentages", () => {
    expect(parsePercentInput("50")).toBe(50);
    expect(parsePercentInput("33.33")).toBe(33.33);
    expect(parsePercentInput(".5")).toBe(0.5);
    expect(parsePercentInput(" 12.5 ")).toBe(12.5);
    expect(parsePercentInput("100")).toBe(100);
  });

  it("rejects out-of-range and malformed values", () => {
    expect(parsePercentInput("")).toBeNull();
    expect(parsePercentInput("abc")).toBeNull();
    expect(parsePercentInput("-5")).toBeNull();
    expect(parsePercentInput("100.01")).toBeNull();
    expect(parsePercentInput("50.123")).toBeNull();
    expect(parsePercentInput("1,5")).toBeNull();
  });
});
