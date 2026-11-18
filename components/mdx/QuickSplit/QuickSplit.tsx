"use client";

import dynamic from "next/dynamic";

// Loaded on demand, so pages that never render <QuickSplit /> don't download the calculator.
const SplitCalculator = dynamic(() =>
  import("@/components/shared/SplitCalculator/SplitCalculator").then(
    (module) => module.SplitCalculator,
  ),
);

export function QuickSplit() {
  return <SplitCalculator />;
}
