"use client";

import { CalculatorCard } from "./components";
import { useSplitCalculator } from "./useSplitCalculator";

export function SplitCalculator() {
  const calculator = useSplitCalculator();

  return <CalculatorCard calculator={calculator} />;
}
