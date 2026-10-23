"use client";

import { AlertCircle, CheckCircle2, Copy, Pencil, RotateCcw } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ShareBar } from "@/components/ui/share-bar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { formatCents } from "@/lib/currency";
import { AVATAR_TINTS } from "../../const";
import type { ResultViewProps } from "../../types";

function displayName(name: string, index: number) {
  return name.trim() || `Person ${index + 1}`;
}

export function ResultView({
  totalCents,
  peopleCount,
  participants,
  sharesCents,
  isCustomized,
  status,
  copyStatus,
  leftoverCents,
  equalShareCents,
  resultRef,
  onCustomize,
  onCopy,
  onReset,
}: ResultViewProps) {
  const recipients = participants
    .slice(0, leftoverCents)
    .map((participant, index) => displayName(participant.name, index))
    .join(", ");

  return (
    <div ref={resultRef} tabIndex={-1} className="flex flex-col gap-6 outline-none">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">
          {isCustomized ? "Bill total" : `Each of ${peopleCount} pays`}
        </span>
        <AnimatedNumber
          value={isCustomized ? totalCents : equalShareCents}
          format="currency"
          className="text-display-md font-medium"
        />
        <span className="text-sm text-muted-foreground">
          {isCustomized
            ? `split ${peopleCount} ways`
            : `of a ${formatCents(totalCents)} bill`}
        </span>
      </div>

      <ShareBar
        segments={participants.map((participant, index) => ({
          id: `${participant.id}-${index}`,
          cents: sharesCents[index] ?? 0,
        }))}
      />

      <ul className="flex flex-col">
        {participants.map((participant, index) => (
          <li
            key={participant.id}
            className="flex items-center gap-3 border-b border-border py-2.5 last:border-b-0"
          >
            <Avatar size="sm">
              <AvatarFallback
                className={cn(
                  AVATAR_TINTS[index % AVATAR_TINTS.length],
                  "font-medium",
                )}
              >
                {displayName(participant.name, index).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate text-base">
              {displayName(participant.name, index)}
            </span>
            <span className="text-base font-medium tabular-nums">
              {formatCents(sharesCents[index] ?? 0)}
            </span>
          </li>
        ))}
      </ul>

      {!isCustomized && leftoverCents > 0 && (
        <p className="text-sm text-muted-foreground">
          The extra {formatCents(leftoverCents)} goes to {recipients}.
        </p>
      )}

      <div className="flex items-center gap-2 text-sm">
        {status.tone === "valid" ? (
          <CheckCircle2 aria-hidden="true" className="size-4 text-primary-text" />
        ) : (
          <AlertCircle aria-hidden="true" className="size-4 text-destructive" />
        )}
        <span
          className={
            status.tone === "valid" ? "text-primary-text" : "text-destructive"
          }
        >
          {status.text}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Button className="h-11 w-full text-base" onClick={onCustomize}>
          <Pencil aria-hidden="true" data-icon="inline-start" />
          Customise split
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-11 flex-1 text-base"
            onClick={onCopy}
          >
            <Copy aria-hidden="true" data-icon="inline-start" />
            Copy
          </Button>
          <Button
            variant="ghost"
            className="h-11 flex-1 text-base"
            onClick={onReset}
          >
            <RotateCcw aria-hidden="true" data-icon="inline-start" />
            Start over
          </Button>
        </div>
      </div>

      <p aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {copyStatus === "copied" && (
          <span className="text-primary-text">Copied to clipboard.</span>
        )}
        {copyStatus === "error" && "Copy blocked — select the list and copy manually."}
      </p>
    </div>
  );
}
