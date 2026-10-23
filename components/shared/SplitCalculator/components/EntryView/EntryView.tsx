"use client";

import { ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EntryFormProps } from "../../types";

export function EntryView({
  amountInput,
  amountError,
  peopleCount,
  minPeople,
  maxPeople,
  amountInputRef,
  onAmountChange,
  onPeopleChange,
  onSubmit,
}: EntryFormProps) {
  const errorId = "split-amount-error";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="split-bill-total">Bill total</Label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground"
          >
            ₹
          </span>
          <Input
            id="split-bill-total"
            ref={amountInputRef}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            className="h-14 pl-8 text-lg tabular-nums"
            value={amountInput}
            aria-invalid={amountError ? true : undefined}
            aria-describedby={amountError ? errorId : undefined}
            onChange={(event) => onAmountChange(event.target.value)}
          />
        </div>
        {amountError && (
          <p id={errorId} className="text-sm text-destructive">
            {amountError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="split-people-count">People</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-12"
            aria-label="Remove one person"
            disabled={peopleCount <= minPeople}
            onClick={() => onPeopleChange(-1)}
          >
            <Minus aria-hidden="true" />
          </Button>
          <output
            id="split-people-count"
            className="min-w-10 text-center text-lg tabular-nums"
            aria-live="polite"
          >
            {peopleCount}
          </output>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-12"
            aria-label="Add one person"
            disabled={peopleCount >= maxPeople}
            onClick={() => onPeopleChange(1)}
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
      </div>

      <Button type="submit" className="h-12 w-full text-base">
        Split it
        <ArrowRight aria-hidden="true" data-icon="inline-end" />
      </Button>
    </form>
  );
}
