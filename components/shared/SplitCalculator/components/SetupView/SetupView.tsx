"use client";

import { ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { formatCents } from "@/lib/currency";
import { ParticipantRow } from "../ParticipantRow/ParticipantRow";
import type { SetupViewProps } from "../../types";

export function SetupView({
  participants,
  minPeople,
  maxPeople,
  totalCents,
  balancesCents,
  equalShareCents,
  notice,
  canSubmit,
  firstPaymentRef,
  onPeopleChange,
  onNameChange,
  onNameFocus,
  onPaidChange,
  onPaidBlur,
  onSubmit,
}: SetupViewProps) {
  const peopleCount = participants.length;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">People</span>
          <span className="text-sm text-muted-foreground">
            Everyone who shared the bill.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11"
            aria-label="Remove one person"
            disabled={peopleCount <= minPeople}
            onClick={() => onPeopleChange(-1)}
          >
            <Minus aria-hidden="true" />
          </Button>
          <output
            aria-label="People count"
            className="min-w-8 text-center text-lg tabular-nums"
            aria-live="polite"
          >
            {peopleCount}
          </output>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11"
            aria-label="Add one person"
            disabled={peopleCount >= maxPeople}
            onClick={() => onPeopleChange(1)}
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <span className="flex-1 pl-9">Person</span>
          <span className="w-32 shrink-0">Paid</span>
        </div>

        <ul className="flex flex-col divide-y divide-border">
          {participants.map((participant, index) => (
            <ParticipantRow
              key={participant.id}
              participant={participant}
              index={index}
              balanceCents={balancesCents[index] ?? 0}
              isBalanceVisible={canSubmit}
              paidInputRef={index === 0 ? firstPaymentRef : undefined}
              onNameChange={onNameChange}
              onNameFocus={onNameFocus}
              onPaidChange={onPaidChange}
              onPaidBlur={onPaidBlur}
            />
          ))}
        </ul>
      </div>

      <div role="group" aria-label="Split summary">
        <dl className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-sm text-muted-foreground">Total paid</dt>
            <dd className="text-lg font-medium tabular-nums">
              {formatCents(totalCents)}
            </dd>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <dt className="text-sm text-muted-foreground">
              Each person&apos;s share
            </dt>
            <dd className="text-lg font-medium tabular-nums">
              {formatCents(equalShareCents)}
            </dd>
          </div>
        </dl>
      </div>

      <p
        aria-live="polite"
        className={cn(
          "min-h-5 text-sm",
          notice?.tone === "error" ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {notice?.text}
      </p>

      <Button
        type="submit"
        className="h-12 w-full text-base"
        disabled={!canSubmit}
      >
        See who pays whom
        <ArrowRight aria-hidden="true" data-icon="inline-end" />
      </Button>
    </form>
  );
}
