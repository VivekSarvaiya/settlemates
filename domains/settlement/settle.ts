/**
 * Settlement engine: turn "who paid what" + "who owes what" into the smallest
 * practical set of payments. Per the tech design (F7) this is the standard greedy
 * debt-simplification / min-cash-flow approach: repeatedly match the largest
 * creditor with the largest debtor until every balance is zero.
 *
 * Pure, integer minor units only. The Quick Split calculator and the future group
 * settlement API both consume this module — do not re-implement the matching.
 */

export interface SettlementTransaction {
  /** Index into the caller's participant list. */
  fromIndex: number;
  /** Index into the caller's participant list. */
  toIndex: number;
  amountCents: number;
}

export type SettlementErrorCode =
  | "no-participants"
  | "length-mismatch"
  | "invalid-paid-amount"
  | "invalid-share"
  | "invalid-balance"
  | "amount-mismatch"
  | "unbalanced";

export interface SettlementError {
  code: SettlementErrorCode;
  message: string;
  rowIndex?: number;
  differenceCents?: number;
}

export type SettlementResult =
  | { ok: true; transactions: SettlementTransaction[] }
  | { ok: false; error: SettlementError };

interface Account {
  index: number;
  amountCents: number;
}

/**
 * `paidCents[i]` is what participant i contributed, `sharesCents[i]` is what they
 * owe. Positive net balances get money back, negative balances pay.
 */
export function computeSettlement(
  paidCents: readonly number[],
  sharesCents: readonly number[],
): SettlementResult {
  if (paidCents.length !== sharesCents.length) {
    return fail(
      "length-mismatch",
      "Paid amounts and shares must describe the same participants.",
    );
  }
  if (paidCents.length === 0) {
    return fail("no-participants", "At least one participant is required.");
  }

  const paidErrorIndex = paidCents.findIndex(
    (amount) => !isNonNegativeInteger(amount),
  );
  if (paidErrorIndex !== -1) {
    return fail(
      "invalid-paid-amount",
      "Every paid amount must be a whole number of zero or more minor units.",
      { rowIndex: paidErrorIndex },
    );
  }

  const shareErrorIndex = sharesCents.findIndex(
    (share) => !isNonNegativeInteger(share),
  );
  if (shareErrorIndex !== -1) {
    return fail(
      "invalid-share",
      "Every share must be a whole number of zero or more minor units.",
      { rowIndex: shareErrorIndex },
    );
  }

  const paidTotal = paidCents.reduce((sum, amount) => sum + BigInt(amount), BigInt(0));
  const shareTotal = sharesCents.reduce((sum, share) => sum + BigInt(share), BigInt(0));

  if (paidTotal !== shareTotal) {
    return fail(
      "amount-mismatch",
      "Paid amounts and shares must add up to the same total.",
      { differenceCents: toSafeNumber(paidTotal - shareTotal) },
    );
  }

  const balances = paidCents.map((amount, index) => amount - sharesCents[index]);
  return settleBalances(balances);
}

/** Net balances: positive means the participant is owed money. */
export function settleBalances(
  netBalancesCents: readonly number[],
): SettlementResult {
  const errorIndex = netBalancesCents.findIndex(
    (balance) => !Number.isSafeInteger(balance),
  );
  if (errorIndex !== -1) {
    return fail(
      "invalid-balance",
      "Every balance must be a whole number of minor units.",
      { rowIndex: errorIndex },
    );
  }

  const balanceTotal = netBalancesCents.reduce(
    (sum, balance) => sum + BigInt(balance),
    BigInt(0),
  );
  if (balanceTotal !== BigInt(0)) {
    return fail(
      "unbalanced",
      "Balances must add up to zero before they can be settled.",
      { differenceCents: toSafeNumber(balanceTotal) },
    );
  }

  const creditors: Account[] = [];
  const debtors: Account[] = [];

  netBalancesCents.forEach((balance, index) => {
    if (balance > 0) {
      creditors.push({ index, amountCents: balance });
    } else if (balance < 0) {
      debtors.push({ index, amountCents: -balance });
    }
  });

  const transactions: SettlementTransaction[] = [];

  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = takeLargest(creditors);
    const debtor = takeLargest(debtors);
    const amountCents = Math.min(creditor.amountCents, debtor.amountCents);

    transactions.push({
      fromIndex: debtor.index,
      toIndex: creditor.index,
      amountCents,
    });

    creditor.amountCents -= amountCents;
    debtor.amountCents -= amountCents;

    if (creditor.amountCents > 0) creditors.push(creditor);
    if (debtor.amountCents > 0) debtors.push(debtor);
  }

  return { ok: true, transactions };
}

/** Largest amount first; ties go to the lowest participant index. */
function takeLargest(accounts: Account[]): Account {
  let largestIndex = 0;

  for (let index = 1; index < accounts.length; index += 1) {
    const candidate = accounts[index];
    const largest = accounts[largestIndex];
    if (
      candidate.amountCents > largest.amountCents ||
      (candidate.amountCents === largest.amountCents &&
        candidate.index < largest.index)
    ) {
      largestIndex = index;
    }
  }

  return accounts.splice(largestIndex, 1)[0];
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

function toSafeNumber(value: bigint): number {
  const max = BigInt(Number.MAX_SAFE_INTEGER);
  if (value > max) return Number.MAX_SAFE_INTEGER;
  if (value < -max) return -Number.MAX_SAFE_INTEGER;
  return Number(value);
}

function fail(
  code: SettlementErrorCode,
  message: string,
  details: Pick<SettlementError, "rowIndex" | "differenceCents"> = {},
): SettlementResult {
  return { ok: false, error: { code, message, ...details } };
}
