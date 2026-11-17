"use client";

import { CheckCircle2, Copy, Pencil, RotateCcw, Share2 } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { formatCents } from "@/lib/currency";
import { AVATAR_TINTS, BALANCE_TONE_CLASSES } from "../../const";
import { displayName } from "../../displayName";
import { describeBalance } from "../../phrases";
import type { ResultViewProps } from "../../types";
import { SettlementList } from "../SettlementList/SettlementList";

export function ResultView({
  totalCents,
  participants,
  paidCents,
  balancesCents,
  leftoverCents,
  leftoverRecipientIndexes,
  equalShareCents,
  settlements,
  copyStatus,
  canShare,
  resultRef,
  onEditSplit,
  onCopy,
  onShare,
  onReset,
}: ResultViewProps) {
  const recipients = leftoverRecipientIndexes
    .flatMap((participantIndex) => {
      const participant = participants[participantIndex];
      return participant
        ? [displayName(participant.name, participantIndex)]
        : [];
    })
    .join(", ");
  const peopleLabel = `${participants.length} ${participants.length === 1 ? "person" : "people"}`;

  return (
    <div
      ref={resultRef}
      tabIndex={-1}
      className="flex scroll-mt-36 flex-col gap-6 outline-none"
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">
          Each person&apos;s share
        </span>
        <AnimatedNumber
          value={equalShareCents}
          format="currency"
          className="text-display-md font-medium"
        />
        <span className="text-sm text-muted-foreground">
          {peopleLabel} · {formatCents(totalCents)} bill
        </span>
      </div>

      <ul aria-label="Shares" className="flex flex-col">
        {participants.map((participant, index) => {
          const balance = describeBalance(balancesCents[index] ?? 0);

          return (
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
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-base">
                    {displayName(participant.name, index)}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-medium whitespace-nowrap tabular-nums",
                      BALANCE_TONE_CLASSES[balance.tone],
                    )}
                  >
                    {balance.text}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums">
                  paid {formatCents(paidCents[index] ?? 0)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {leftoverCents > 0 && (
        <p className="text-sm text-muted-foreground">
          The extra {formatCents(leftoverCents)} goes to {recipients}.
        </p>
      )}

      {settlements.length > 0 ? (
        <SettlementList participants={participants} transactions={settlements} />
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm">
          <CheckCircle2
            aria-hidden="true"
            className="size-4 shrink-0 text-primary-text"
          />
          <span className="text-primary-text">
            Everyone&apos;s square. No one needs to pay anyone.
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {canShare ? (
          <Button className="h-12 w-full text-base" onClick={onShare}>
            <Share2 aria-hidden="true" data-icon="inline-start" />
            Share with the group
          </Button>
        ) : (
          <Button className="h-12 w-full text-base" onClick={onCopy}>
            <Copy aria-hidden="true" data-icon="inline-start" />
            Copy for the group chat
          </Button>
        )}
        <div className="flex gap-2">
          {canShare && (
            <Button
              variant="outline"
              className="h-11 flex-1 text-base"
              onClick={onCopy}
            >
              <Copy aria-hidden="true" data-icon="inline-start" />
              Copy
            </Button>
          )}
          <Button
            variant="outline"
            className="h-11 flex-1 text-base"
            onClick={onEditSplit}
          >
            <Pencil aria-hidden="true" data-icon="inline-start" />
            Edit
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
          <span className="text-primary-text">
            Copied, with a link that reopens this split. Paste it in the group
            chat.
          </span>
        )}
        {copyStatus === "error" &&
          "Copy blocked — select the list and copy manually."}
      </p>
    </div>
  );
}
