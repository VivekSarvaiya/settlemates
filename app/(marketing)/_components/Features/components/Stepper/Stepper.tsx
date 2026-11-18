import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StepperProps } from "./types";

export function Stepper({
  label,
  value,
  min,
  max,
  decreaseLabel,
  increaseLabel,
  onDecrease,
  onIncrease,
}: StepperProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label={decreaseLabel}
        disabled={value <= min}
        onClick={onDecrease}
      >
        <Minus aria-hidden="true" />
      </Button>
      <output
        aria-label={label}
        aria-live="polite"
        className="min-w-7 text-center text-base font-medium tabular-nums"
      >
        {value}
      </output>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label={increaseLabel}
        disabled={value >= max}
        onClick={onIncrease}
      >
        <Plus aria-hidden="true" />
      </Button>
    </div>
  );
}
