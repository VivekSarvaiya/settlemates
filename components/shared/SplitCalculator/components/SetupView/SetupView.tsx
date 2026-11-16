"use client";

import { ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/currency";
import { ParticipantRow } from "../ParticipantRow/ParticipantRow";
import type { SetupViewProps } from "../../types";

export function SetupView({
  participants,
  minPeople,
  maxPeople,
  totalCents,
  sharesCents,
  equalShareCents,
  notice,
  canSubmit,
  firstPaymentRef,
  onPeopleChange,
  onNameChange,
  onPaidChange,
  onSubmit,
}: SetupViewProps) {
  const peopleCount = participants.length;
  const areSharesVisible = totalCents > 0;

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
        <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <span className="flex-1 pl-9">Person</span>
          <span className="w-28 shrink-0">Paid</span>
          {areSharesVisible && (
            <span className="w-24 shrink-0 text-right">Share</span>
          )}
        </div>

        <ul className="flex flex-col divide-y divide-border">
          {participants.map((participant, index) => (
            <ParticipantRow
              key={participant.id}
              participant={participant}
              index={index}
              shareCents={sharesCents[index] ?? 0}
              areSharesVisible={areSharesVisible}
              paidInputRef={index === 0 ? firstPaymentRef : undefined}
              onNameChange={onNameChange}
              onPaidChange={onPaidChange}
            />
          ))}
        </ul>
      </div>

      <dl
        role="group"
        aria-label="Split summary"
        className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 px-4 py-3"
      >
        <div className="flex flex-col gap-0.5">
          <dt className="text-sm text-muted-foreground">Total paid</dt>
          <dd className="text-xl font-medium tabular-nums">
            {formatCents(totalCents)}
          </dd>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <dt className="text-sm text-muted-foreground">Each pays</dt>
          <dd className="text-xl font-medium tabular-nums">
            {formatCents(equalShareCents)}
          </dd>
        </div>
      </dl>

      {notice && (
        <p
          aria-live="polite"
          className={
            notice.tone === "error"
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {notice.text}
        </p>
      )}

      <Button
        type="submit"
        className="h-12 w-full text-base"
        disabled={!canSubmit}
      >
        Split it
        <ArrowRight aria-hidden="true" data-icon="inline-end" />
      </Button>
    </form>
  );
}
