"use client";

import { Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { parseAmountToCents } from "@/lib/currency";
import {
  AVATAR_TINTS,
  BALANCE_TONE_CLASSES,
  MAX_NAME_LENGTH,
} from "../../const";
import { describeBalance } from "../../phrases";
import type { ParticipantRowProps } from "../../types";

export function ParticipantRow({
  participant,
  index,
  balanceCents,
  isBalanceVisible,
  paidInputRef,
  onNameChange,
  onNameFocus,
  onPaidChange,
  onPaidBlur,
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
  const balance = describeBalance(balanceCents);

  return (
    <li className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
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
          <div className="group relative">
            <Input
              id={nameId}
              autoComplete="off"
              maxLength={MAX_NAME_LENGTH}
              className="h-8 rounded-none border-0 border-b border-dashed border-border bg-transparent px-0 pr-6 shadow-none hover:border-foreground/40 focus-visible:border-solid focus-visible:border-ring focus-visible:ring-0"
              value={participant.name}
              onFocus={onNameFocus}
              onChange={(event) => onNameChange(participant.id, event.target.value)}
            />
            <Pencil
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-1 size-3.5 -translate-y-1/2 text-muted-foreground group-focus-within:hidden"
            />
          </div>
        </div>

        <div className="relative w-32 shrink-0">
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
            className="h-9 w-32 pl-6 tabular-nums"
            aria-invalid={isPaidInvalid ? true : undefined}
            value={participant.paidInput}
            onChange={(event) => onPaidChange(participant.id, event.target.value)}
            onBlur={() => onPaidBlur(participant.id)}
          />
        </div>
      </div>
      <span
        className={cn(
          "min-h-5 pl-9 text-sm tabular-nums",
          BALANCE_TONE_CLASSES[balance.tone],
        )}
      >
        {isBalanceVisible ? balance.text : ""}
      </span>
    </li>
  );
}
