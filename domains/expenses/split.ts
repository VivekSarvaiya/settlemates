export type SplitMode = "equal" | "percentage" | "exact";

export type SplitAllocation =
  | { mode: "equal" }
  | { mode: "percentage"; percent: number }
  | { mode: "exact"; cents: number };

export interface SplitResult {
  sharesCents: number[];
  allocatedCents: number;
  /** Positive: unassigned money left over. Negative: allocation is over the total. */
  remainderCents: number;
  isValid: boolean;
}

export function splitEqually(
  totalCents: number,
  participantCount: number,
): number[] {
  if (totalCents < 0 || participantCount < 1) return [];
  return distributeEqually(totalCents, participantCount);
}

export function computeSplit(
  totalCents: number,
  allocations: SplitAllocation[],
): SplitResult {
  const sharesCents = allocations.map(() => 0);

  if (totalCents <= 0 || allocations.length === 0) {
    return {
      sharesCents,
      allocatedCents: 0,
      remainderCents: totalCents,
      isValid: false,
    };
  }

  let exactSum = 0;
  let hasInvalidValue = false;
  const percentWeights: number[] = [];
  const percentIndexes: number[] = [];
  const equalIndexes: number[] = [];

  allocations.forEach((allocation, index) => {
    if (allocation.mode === "exact") {
      if (!Number.isFinite(allocation.cents) || allocation.cents < 0) {
        hasInvalidValue = true;
        return;
      }
      sharesCents[index] = Math.round(allocation.cents);
      exactSum += sharesCents[index];
    } else if (allocation.mode === "percentage") {
      if (
        !Number.isFinite(allocation.percent) ||
        allocation.percent < 0 ||
        allocation.percent > 100
      ) {
        hasInvalidValue = true;
        return;
      }
      percentWeights.push(allocation.percent);
      percentIndexes.push(index);
    } else {
      equalIndexes.push(index);
    }
  });

  const percentSum = percentWeights.reduce((sum, weight) => sum + weight, 0);
  const percentCentsTotal = Math.round((totalCents * percentSum) / 100);
  const percentShares = distributeProportionally(percentCentsTotal, percentWeights);
  percentIndexes.forEach((allocationIndex, weightIndex) => {
    sharesCents[allocationIndex] = percentShares[weightIndex];
  });

  const equalPool = totalCents - exactSum - percentCentsTotal;

  if (equalIndexes.length > 0) {
    const equalShares =
      equalPool >= 0
        ? distributeEqually(equalPool, equalIndexes.length)
        : equalIndexes.map(() => 0);
    equalIndexes.forEach((allocationIndex, shareIndex) => {
      sharesCents[allocationIndex] = equalShares[shareIndex];
    });
    const remainderCents = Math.min(equalPool, 0);
    return {
      sharesCents,
      allocatedCents: sum(sharesCents),
      remainderCents,
      isValid: !hasInvalidValue && remainderCents === 0,
    };
  }

  return {
    sharesCents,
    allocatedCents: sum(sharesCents),
    remainderCents: equalPool,
    isValid: !hasInvalidValue && equalPool === 0,
  };
}

const PERCENT_PATTERN = /^(?:\d{1,3}(?:\.\d{1,2})?|\.\d{1,2})$/;

export function parsePercentInput(input: string): number | null {
  const value = input.trim();
  if (!PERCENT_PATTERN.test(value)) return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed > 100) return null;

  return parsed;
}

// Leftover cents go to the earliest rows: the design doc assumes "remainder to payer",
// and in a payer-less quick split the first row is the payer.
function distributeEqually(totalCents: number, participantCount: number): number[] {
  const base = Math.floor(totalCents / participantCount);
  const remainder = totalCents - base * participantCount;
  return Array.from(
    { length: participantCount },
    (_, index) => base + (index < remainder ? 1 : 0),
  );
}

function distributeProportionally(
  totalCents: number,
  weights: number[],
): number[] {
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  if (weightSum <= 0) return weights.map(() => 0);

  const floors = weights.map((weight) =>
    Math.floor((totalCents * weight) / weightSum),
  );
  const remainder = totalCents - sum(floors);
  const byFraction = weights
    .map((weight, index) => ({
      index,
      fraction: (totalCents * weight) / weightSum - floors[index],
    }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);

  const shares = [...floors];
  for (let unit = 0; unit < remainder; unit += 1) {
    shares[byFraction[unit % byFraction.length].index] += 1;
  }
  return shares;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
