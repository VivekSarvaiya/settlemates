"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCents } from "@/lib/currency";
import { ParticipantRow } from "../ParticipantRow/ParticipantRow";
import { SPLIT_MODE_OPTIONS } from "../../const";
import type { CustomizeViewProps } from "../../types";

export function CustomizeView({
  totalCents,
  participants,
  sharesCents,
  splitMode,
  status,
  isValid,
  equalShareCents,
  equalSharePercent,
  customizeRef,
  onNameChange,
  onModeChange,
  onValueChange,
  onApply,
  onBack,
}: CustomizeViewProps) {
  const activeMode =
    SPLIT_MODE_OPTIONS.find((option) => option.value === splitMode) ??
    SPLIT_MODE_OPTIONS[0];

  return (
    <div ref={customizeRef} tabIndex={-1} className="flex flex-col gap-6 outline-none">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" className="text-base" onClick={onBack}>
          <ArrowLeft aria-hidden="true" data-icon="inline-start" />
          Back
        </Button>
        <span className="text-base font-medium tabular-nums">
          {formatCents(totalCents)}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div
          role="group"
          aria-label="Split by"
          className="grid grid-cols-3 gap-1 rounded-lg border border-border p-1"
        >
          {SPLIT_MODE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={splitMode === option.value ? "secondary" : "ghost"}
              className="h-10 text-base"
              aria-pressed={splitMode === option.value}
              onClick={() => onModeChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{activeMode.description}</p>
      </div>

      <ul className="flex flex-col divide-y divide-border">
        {participants.map((participant, index) => (
          <ParticipantRow
            key={participant.id}
            participant={participant}
            index={index}
            shareCents={sharesCents[index] ?? 0}
            splitMode={splitMode}
            equalShareCents={equalShareCents}
            equalSharePercent={equalSharePercent}
            onNameChange={onNameChange}
            onValueChange={onValueChange}
          />
        ))}
      </ul>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm">
          {status.tone === "valid" ? (
            <CheckCircle2
              aria-hidden="true"
              className="size-4 shrink-0 text-primary-text"
            />
          ) : (
            <AlertCircle
              aria-hidden="true"
              className="size-4 shrink-0 text-destructive"
            />
          )}
          <span
            className={
              status.tone === "valid" ? "text-primary-text" : "text-destructive"
            }
          >
            {status.text}
          </span>
        </div>
        <Button
          className="h-11 w-full text-base"
          disabled={!isValid}
          onClick={onApply}
        >
          Apply split
          <ArrowRight aria-hidden="true" data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
