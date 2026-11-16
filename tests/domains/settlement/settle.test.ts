import { describe, expect, it } from "vitest";
import {
  computeSettlement,
  settleBalances,
  type SettlementResult,
  type SettlementTransaction,
} from "@/domains/settlement/settle";

function expectOk(result: SettlementResult): SettlementTransaction[] {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`Expected a settlement, got ${result.error.code}`);
  return result.transactions;
}

function expectError(
  result: SettlementResult,
): Extract<SettlementResult, { ok: false }>["error"] {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected the settlement to be rejected");
  return result.error;
}

function netByParticipant(
  transactions: readonly SettlementTransaction[],
  participantCount: number,
): number[] {
  const nets = Array.from({ length: participantCount }, () => 0);

  for (const transaction of transactions) {
    nets[transaction.fromIndex] -= transaction.amountCents;
    nets[transaction.toIndex] += transaction.amountCents;
  }

  return nets;
}

const OFFICE_PAID = [0, 90_000, 77_500, 14_000, 24_800, 6_000, 8_000, 0, 0, 0, 0, 0];
// ₹2,203 split equally across 12: the first four get the four leftover paise.
const OFFICE_SHARES = [
  18_359, 18_359, 18_359, 18_359, 18_358, 18_358, 18_358, 18_358, 18_358, 18_358,
  18_358, 18_358,
];

describe("computeSettlement", () => {
  it("settles the office event in 11 payments, the minimum for those balances", () => {
    const transactions = expectOk(computeSettlement(OFFICE_PAID, OFFICE_SHARES));

    expect(transactions).toEqual([
      { fromIndex: 0, toIndex: 1, amountCents: 18_359 },
      { fromIndex: 7, toIndex: 2, amountCents: 18_358 },
      { fromIndex: 8, toIndex: 1, amountCents: 18_358 },
      { fromIndex: 9, toIndex: 2, amountCents: 18_358 },
      { fromIndex: 10, toIndex: 1, amountCents: 18_358 },
      { fromIndex: 11, toIndex: 2, amountCents: 18_358 },
      { fromIndex: 5, toIndex: 1, amountCents: 12_358 },
      { fromIndex: 6, toIndex: 4, amountCents: 6442 },
      { fromIndex: 3, toIndex: 1, amountCents: 4208 },
      { fromIndex: 6, toIndex: 2, amountCents: 3916 },
      { fromIndex: 3, toIndex: 2, amountCents: 151 },
    ]);
    expect(transactions).toHaveLength(11);
  });

  it("moves every office balance to zero without losing a paisa", () => {
    const transactions = expectOk(computeSettlement(OFFICE_PAID, OFFICE_SHARES));
    const nets = netByParticipant(transactions, OFFICE_PAID.length);

    expect(nets).toEqual(
      OFFICE_PAID.map((paid, index) => paid - OFFICE_SHARES[index]),
    );
    expect(transactions.reduce((sum, t) => sum + t.amountCents, 0)).toBe(137_224);
  });

  it("settles a single-payer bill by paying the payer", () => {
    const transactions = expectOk(
      computeSettlement([10_000, 0, 0], [3334, 3333, 3333]),
    );

    expect(transactions).toEqual([
      { fromIndex: 1, toIndex: 0, amountCents: 3333 },
      { fromIndex: 2, toIndex: 0, amountCents: 3333 },
    ]);
  });

  it("uses the largest debtor and largest creditor each time", () => {
    const transactions = expectOk(
      computeSettlement([500, 0, 0], [0, 200, 300]),
    );

    expect(transactions).toEqual([
      { fromIndex: 2, toIndex: 0, amountCents: 300 },
      { fromIndex: 1, toIndex: 0, amountCents: 200 },
    ]);
  });

  it("breaks ties by participant index", () => {
    const transactions = expectOk(
      settleBalances([100, 100, -100, -100]),
    );

    expect(transactions).toEqual([
      { fromIndex: 2, toIndex: 0, amountCents: 100 },
      { fromIndex: 3, toIndex: 1, amountCents: 100 },
    ]);
  });

  it("returns no payments when everyone already matches", () => {
    expect(expectOk(computeSettlement([100, 200], [100, 200]))).toEqual([]);
    expect(expectOk(computeSettlement([0, 0], [0, 0]))).toEqual([]);
  });

  it("rejects participant lists of different lengths", () => {
    expect(expectError(computeSettlement([100], [100, 0])).code).toBe(
      "length-mismatch",
    );
    expect(expectError(computeSettlement([], [])).code).toBe("no-participants");
  });

  it("rejects invalid paid amounts", () => {
    expect(
      expectError(computeSettlement([100, -1], [50, 49])),
    ).toMatchObject({ code: "invalid-paid-amount", rowIndex: 1 });
    expect(
      expectError(computeSettlement([100, 1.5], [50, 51.5])).code,
    ).toBe("invalid-paid-amount");
    expect(
      expectError(computeSettlement([100, Number.NaN], [50, 50])).code,
    ).toBe("invalid-paid-amount");
  });

  it("rejects invalid shares", () => {
    expect(expectError(computeSettlement([100, 0], [50, -50]))).toMatchObject({
      code: "invalid-share",
      rowIndex: 1,
    });
  });

  it("rejects paid totals that do not match the shares", () => {
    const under = expectError(computeSettlement([1000], [900]));
    expect(under.code).toBe("amount-mismatch");
    expect(under.differenceCents).toBe(100);

    const over = expectError(computeSettlement([900], [1000]));
    expect(over.code).toBe("amount-mismatch");
    expect(over.differenceCents).toBe(-100);
  });

  it("clamps a difference larger than the safe integer range", () => {
    const max = Number.MAX_SAFE_INTEGER;

    expect(expectError(computeSettlement([max, max], [0, 0])).differenceCents).toBe(
      max,
    );
    expect(expectError(computeSettlement([0, 0], [max, max])).differenceCents).toBe(
      -max,
    );
  });
});

describe("settleBalances", () => {
  it("handles an empty participant list", () => {
    expect(expectOk(settleBalances([]))).toEqual([]);
  });

  it("ignores participants with a zero balance", () => {
    expect(expectOk(settleBalances([0, 250, 0, -250, 0]))).toEqual([
      { fromIndex: 3, toIndex: 1, amountCents: 250 },
    ]);
  });

  it("settles a chain in a single payment per creditor", () => {
    const transactions = expectOk(settleBalances([300, -100, -100, -100]));

    expect(transactions).toEqual([
      { fromIndex: 1, toIndex: 0, amountCents: 100 },
      { fromIndex: 2, toIndex: 0, amountCents: 100 },
      { fromIndex: 3, toIndex: 0, amountCents: 100 },
    ]);
  });

  it("rejects balances that do not add up to zero", () => {
    const error = expectError(settleBalances([100, -50]));

    expect(error.code).toBe("unbalanced");
    expect(error.differenceCents).toBe(50);
  });

  it("rejects fractional, NaN, and unsafe balances", () => {
    expect(expectError(settleBalances([1.5, -1.5]))).toMatchObject({
      code: "invalid-balance",
      rowIndex: 0,
    });
    expect(expectError(settleBalances([Number.NaN, 0])).code).toBe(
      "invalid-balance",
    );
    expect(
      expectError(settleBalances([Number.MAX_SAFE_INTEGER + 1, 0])).code,
    ).toBe("invalid-balance");
  });

  it("settles large balances exactly", () => {
    const max = Number.MAX_SAFE_INTEGER;
    const transactions = expectOk(settleBalances([max, -max]));

    expect(transactions).toEqual([
      { fromIndex: 1, toIndex: 0, amountCents: max },
    ]);
  });

  it("is deterministic", () => {
    expect(settleBalances(OFFICE_PAID.map((paid, i) => paid - OFFICE_SHARES[i]))).toEqual(
      settleBalances(OFFICE_PAID.map((paid, i) => paid - OFFICE_SHARES[i])),
    );
  });
});
