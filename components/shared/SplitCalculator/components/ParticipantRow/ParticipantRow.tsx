"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { parsePercentInput } from "@/domains/expenses/split";
import { formatCents, parseAmountToCents } from "@/lib/currency";
import { AVATAR_TINTS } from "../../const";
import type { ParticipantRowProps } from "../../types";

export function ParticipantRow({
  participant,
  index,
  shareCents,
  splitMode,
  equalShareCents,
  equalSharePercent,
  onNameChange,
  onValueChange,
}: ParticipantRowProps) {
  const nameId = `split-name-${participant.id}`;
  const valueId = `split-value-${participant.id}`;
  const isPercentage = splitMode === "percentage";
  const isValueMode = splitMode !== "equal";
  const isValueInvalid =
    isValueMode &&
    participant.value.trim() !== "" &&
    (isPercentage
      ? parsePercentInput(participant.value) === null
      : parseAmountToCents(participant.value) === null);

  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <Avatar size="sm">
        <AvatarFallback
          className={cn(
            AVATAR_TINTS[index % AVATAR_TINTS.length],
            "font-medium",
          )}
        >
          {(participant.name.trim() || "?").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col">
        <label htmlFor={nameId} className="sr-only">
          Name for person {index + 1}
        </label>
        <Input
          id={nameId}
          autoComplete="off"
          className="h-9 border-transparent bg-transparent px-0 shadow-none hover:bg-muted focus-visible:bg-background"
          value={participant.name}
          onChange={(event) => onNameChange(participant.id, event.target.value)}
        />
      </div>

      {isValueMode && (
        <div className="relative shrink-0">
          <label htmlFor={valueId} className="sr-only">
            {isPercentage
              ? `Percentage for person ${index + 1}`
              : `Exact amount for person ${index + 1}`}
          </label>
          <Input
            id={valueId}
            inputMode="decimal"
            autoComplete="off"
            className={cn("h-9 w-24 tabular-nums", isPercentage && "pr-7")}
            placeholder={
              isPercentage ? `${equalSharePercent}` : formatCents(equalShareCents)
            }
            aria-invalid={isValueInvalid ? true : undefined}
            value={participant.value}
            onChange={(event) => onValueChange(participant.id, event.target.value)}
          />
          {isPercentage && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted-foreground"
            >
              %
            </span>
          )}
        </div>
      )}

      {splitMode !== "exact" && (
        <span className="w-24 shrink-0 text-right text-base font-medium tabular-nums">
          {formatCents(shareCents)}
        </span>
      )}
    </li>
  );
}
