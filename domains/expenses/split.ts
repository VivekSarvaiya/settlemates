export type SplitMode = "equal" | "exact" | "percentage" | "shares";

export type SplitValue = number | null;

interface SplitBase {
  totalCents: number;
  /** Person who paid. Equal-split remainder units go here first. Defaults to 0. */
  payerIndex?: number;
}

export type SplitInput =
  | (SplitBase & { mode: "equal"; participantCount: number })
  | (SplitBase & { mode: "exact"; amountsCents: readonly SplitValue[] })
  | (SplitBase & { mode: "percentage"; percentages: readonly SplitValue[] })
  | (SplitBase & { mode: "shares"; weights: readonly SplitValue[] });

export type SplitErrorCode =
  | "invalid-total"
  | "no-participants"
  | "invalid-payer-index"
  | "invalid-amount"
  | "invalid-percentage"
  | "invalid-share"
  | "amount-mismatch"
  | "percentage-mismatch"
  | "no-shares";

export interface SplitError {
  code: SplitErrorCode;
  message: string;
  rowIndex?: number;
  differenceCents?: number;
}

export type SplitResult =
  | { ok: true; sharesCents: number[] }
  /** Preview is for rendering in-progress input only — never persist it. */
  | { ok: false; previewSharesCents: number[]; error: SplitError };

export interface EqualSplitSummary {
  sharesCents: number[];
  baseShareCents: number;
  baseSharePercent: number;
  remainderCents: number;
  remainderRecipientIndexes: number[];
}

const PERCENT_EPSILON = 1e-6;
const BASIS_POINTS_PER_PERCENT = 100;
const FULL_PERCENT_BASIS_POINTS = 10_000;

export function splitEqually(
  totalCents: number,
  participantCount: number,
  payerIndex = 0,
): number[] {
  return summarizeEqualSplit(totalCents, participantCount, payerIndex).sharesCents;
}

export function summarizeEqualSplit(
  totalCents: number,
  participantCount: number,
  payerIndex = 0,
): EqualSplitSummary {
  if (
    !Number.isSafeInteger(totalCents) ||
    totalCents < 0 ||
    !isParticipantCount(participantCount) ||
    !isPayerIndex(payerIndex, participantCount)
  ) {
    return {
      sharesCents: [],
      baseShareCents: 0,
      baseSharePercent: 0,
      remainderCents: 0,
      remainderRecipientIndexes: [],
    };
  }

  const baseShareCents = Math.floor(totalCents / participantCount);
  const remainderCents = totalCents - baseShareCents * participantCount;
  const payerFirstOrder = Array.from(
    { length: participantCount },
    (_, offset) => (payerIndex + offset) % participantCount,
  );
  const sharesCents = zeroShares(participantCount);

  for (let participant = 0; participant < participantCount; participant += 1) {
    sharesCents[participant] = baseShareCents;
  }
  // Leftover units go to the payer, then continue in participant order.
  for (let unit = 0; unit < remainderCents; unit += 1) {
    sharesCents[payerFirstOrder[unit]] += 1;
  }

  return {
    sharesCents,
    baseShareCents,
    baseSharePercent: Math.round(1000 / participantCount) / 10,
    remainderCents,
    remainderRecipientIndexes: payerFirstOrder.slice(0, remainderCents),
  };
}

export function computeSplit(input: SplitInput): SplitResult {
  if (!Number.isSafeInteger(input.totalCents) || input.totalCents <= 0) {
    return fail(
      "invalid-total",
      [],
      "Total must be a positive whole number of minor units.",
    );
  }

  const payerIndex = input.payerIndex ?? 0;

  if (input.mode === "equal") {
    if (!isParticipantCount(input.participantCount)) {
      return fail("no-participants", [], "At least one participant is required.");
    }
    if (!isPayerIndex(payerIndex, input.participantCount)) {
      return fail(
        "invalid-payer-index",
        zeroShares(input.participantCount),
        "Payer index is outside the participant list.",
      );
    }
    return {
      ok: true,
      sharesCents: splitEqually(input.totalCents, input.participantCount, payerIndex),
    };
  }

  const rowCount =
    input.mode === "exact"
      ? input.amountsCents.length
      : input.mode === "percentage"
        ? input.percentages.length
        : input.weights.length;

  if (!isParticipantCount(rowCount)) {
    return fail("no-participants", [], "At least one participant is required.");
  }
  if (!isPayerIndex(payerIndex, rowCount)) {
    return fail(
      "invalid-payer-index",
      zeroShares(rowCount),
      "Payer index is outside the participant list.",
    );
  }

  if (input.mode === "exact") {
    return computeExactSplit(input.totalCents, input.amountsCents);
  }
  if (input.mode === "percentage") {
    return computePercentageSplit(input.totalCents, input.percentages);
  }
  return computeSharesSplit(input.totalCents, input.weights);
}

function computeExactSplit(
  totalCents: number,
  amountsCents: readonly SplitValue[],
): SplitResult {
  const previewSharesCents = amountsCents.map((amount) =>
    isNonNegativeInteger(amount) ? amount : 0,
  );
  const enteredCents = amountsCents.reduce(
    (sum, amount) => (isNonNegativeInteger(amount) ? sum + BigInt(amount) : sum),
    BigInt(0),
  );
  const difference = BigInt(totalCents) - enteredCents;

  if (difference !== BigInt(0)) {
    return fail(
      "amount-mismatch",
      previewSharesCents,
      "Exact amounts must add up to the total.",
      { differenceCents: toSafeNumber(difference) },
    );
  }

  const invalidIndex = amountsCents.findIndex(
    (amount) => !isNonNegativeInteger(amount),
  );
  if (invalidIndex !== -1) {
    return fail(
      "invalid-amount",
      previewSharesCents,
      "Every amount must be a whole number of minor units.",
      { rowIndex: invalidIndex },
    );
  }

  return { ok: true, sharesCents: previewSharesCents };
}

function computePercentageSplit(
  totalCents: number,
  percentages: readonly SplitValue[],
): SplitResult {
  const basisPoints = percentages.map(percentToBasisPoints);
  const weights = basisPoints.map((points) => (points ?? 0));
  const totalBasisPoints = weights.reduce((sum, points) => sum + points, 0);
  const assignedPoolCents = mulDivRound(
    totalCents,
    totalBasisPoints,
    FULL_PERCENT_BASIS_POINTS,
  );
  const previewSharesCents = distributeByWeights(assignedPoolCents, weights);

  if (totalBasisPoints !== FULL_PERCENT_BASIS_POINTS) {
    return fail(
      "percentage-mismatch",
      previewSharesCents,
      "Percentages must add up to 100.",
      { differenceCents: totalCents - assignedPoolCents },
    );
  }

  const invalidIndex = basisPoints.findIndex((points) => points === null);
  if (invalidIndex !== -1) {
    return fail(
      "invalid-percentage",
      previewSharesCents,
      "Every percentage must be between 0 and 100 with at most two decimals.",
      { rowIndex: invalidIndex },
    );
  }

  return { ok: true, sharesCents: previewSharesCents };
}

function computeSharesSplit(
  totalCents: number,
  weights: readonly SplitValue[],
): SplitResult {
  const normalizedWeights = weights.map((weight) =>
    isNonNegativeInteger(weight) ? weight : 0,
  );
  const previewSharesCents = distributeByWeights(totalCents, normalizedWeights);
  const invalidIndex = weights.findIndex(
    (weight) => !isNonNegativeInteger(weight),
  );

  if (invalidIndex !== -1) {
    return fail(
      "invalid-share",
      previewSharesCents,
      "Every share weight must be a whole number of zero or more.",
      { rowIndex: invalidIndex },
    );
  }
  if (normalizedWeights.every((weight) => weight === 0)) {
    return fail(
      "no-shares",
      previewSharesCents,
      "At least one share weight must be greater than zero.",
    );
  }

  return { ok: true, sharesCents: previewSharesCents };
}

const PERCENT_PATTERN = /^(?:\d{1,3}(?:\.\d{1,2})?|\.\d{1,2})$/;

export function parsePercentInput(input: string): number | null {
  const value = input.trim();
  if (!PERCENT_PATTERN.test(value)) return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed > 100) return null;

  return parsed;
}

function percentToBasisPoints(value: SplitValue): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 100
  ) {
    return null;
  }

  const scaled = value * BASIS_POINTS_PER_PERCENT;
  const rounded = Math.round(scaled);
  if (Math.abs(scaled - rounded) > PERCENT_EPSILON) return null;

  return rounded;
}

function distributeByWeights(
  totalCents: number,
  weights: readonly number[],
): number[] {
  const weightSum = weights.reduce((sum, weight) => sum + BigInt(weight), BigInt(0));
  if (weightSum <= BigInt(0)) return zeroShares(weights.length);

  const total = BigInt(totalCents);
  const allocations = weights.map((weight) => {
    const product = total * BigInt(weight);
    return {
      shareCents: Number(product / weightSum),
      remainder: product % weightSum,
    };
  });
  const sharesCents = allocations.map(({ shareCents }) => shareCents);
  const leftover =
    totalCents - sharesCents.reduce((sum, share) => sum + share, 0);

  const largestRemainderFirst = allocations
    .map(({ remainder }, index) => ({ index, remainder }))
    .sort((left, right) => {
      if (left.remainder === right.remainder) return left.index - right.index;
      return left.remainder > right.remainder ? -1 : 1;
    });

  for (let unit = 0; unit < leftover; unit += 1) {
    sharesCents[largestRemainderFirst[unit % largestRemainderFirst.length].index] += 1;
  }

  return sharesCents;
}

function mulDivRound(value: number, numerator: number, denominator: number): number {
  const divisor = BigInt(denominator);
  const product = BigInt(value) * BigInt(numerator);
  const quotient = product / divisor;
  const remainder = product % divisor;

  return Number(
    remainder * BigInt(2) >= divisor ? quotient + BigInt(1) : quotient,
  );
}

function toSafeNumber(value: bigint): number {
  const max = BigInt(Number.MAX_SAFE_INTEGER);
  if (value > max) return Number.MAX_SAFE_INTEGER;
  if (value < -max) return -Number.MAX_SAFE_INTEGER;
  return Number(value);
}

function isParticipantCount(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 1;
}

function isPayerIndex(payerIndex: number, participantCount: number): boolean {
  return (
    Number.isSafeInteger(payerIndex) &&
    payerIndex >= 0 &&
    payerIndex < participantCount
  );
}

function isNonNegativeInteger(value: SplitValue): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function zeroShares(count: number): number[] {
  return Array.from({ length: count }, () => 0);
}

function fail(
  code: SplitErrorCode,
  previewSharesCents: number[],
  message: string,
  details: Pick<SplitError, "rowIndex" | "differenceCents"> = {},
): SplitResult {
  return { ok: false, previewSharesCents, error: { code, message, ...details } };
}
