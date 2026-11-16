"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { formatCents, parseAmountToCents } from "@/lib/currency";
import { AVATAR_TINTS } from "../../const";
import type { ParticipantRowProps } from "../../types";

export function ParticipantRow({
  participant,
  index,
  shareCents,
  areSharesVisible,
  paidInputRef,
  onNameChange,
  onPaidChange,
}: ParticipantRowProps) {
  const nameId = `split-name-${participant.id}`;
  const paidId = `split-paid-${participant.id}`;
  const paidCents =
    participant.paidInput.trim() === ""
      ? 0
      : parseAmountToCents(participant.paidInput);
  const isPaidInvalid =
    participant.paidInput.trim() !== "" &&
    (paidCents === null || !Number.isSafeInteger(paidCents));

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

      <div className="relative w-28 shrink-0">
        <label htmlFor={paidId} className="sr-only">
          Amount paid by person {index + 1}
        </label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-sm text-muted-foreground"
        >
          ₹
        </span>
        <Input
          id={paidId}
          ref={paidInputRef}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          className="h-9 w-28 pl-6 tabular-nums"
          aria-invalid={isPaidInvalid ? true : undefined}
          value={participant.paidInput}
          onChange={(event) => onPaidChange(participant.id, event.target.value)}
        />
      </div>

      {areSharesVisible && (
        <span className="w-24 shrink-0 text-right text-base font-medium tabular-nums">
          {formatCents(shareCents)}
        </span>
      )}
    </li>
  );
}
