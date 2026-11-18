"use client";

import { Shuffle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/animation";
import { FEATURES } from "../../const";
import { BentoTile } from "../BentoTile/BentoTile";
import { Stepper } from "../Stepper/Stepper";
import { TileHeader } from "../TileHeader/TileHeader";
import { SettlementGraph } from "./components";
import { PAYMENT_ROW_CLASSES } from "./const";
import type { SettlementTileProps } from "./types";
import { useSettlementTile } from "./useSettlementTile";

export function SettlementTile({
  group,
  peopleCount,
  minPeople,
  maxPeople,
  onAddPerson,
  onRemovePerson,
  onShuffle,
}: SettlementTileProps) {
  const {
    titleId,
    markerId,
    graphRef,
    isGraphInView,
    nodes,
    edges,
    paymentRows,
    readout,
    headline,
    summary,
    handlePersonPointerEnter,
    handlePaymentPointerEnter,
    handlePointerLeave,
    handlePersonPointerUp,
    handlePaymentPointerUp,
  } = useSettlementTile({ group });

  return (
    <BentoTile labelledBy={titleId}>
      <TileHeader id={titleId} feature={FEATURES.settlement} />

      <div className="mt-auto grid grid-cols-1 gap-8 sm:grid-cols-2 sm:items-center">
        <div className="flex flex-col gap-4">
          <SettlementGraph
            graphRef={graphRef}
            markerId={markerId}
            isInView={isGraphInView}
            nodes={nodes}
            edges={edges}
            onPersonPointerEnter={handlePersonPointerEnter}
            onPersonPointerUp={handlePersonPointerUp}
            onPointerLeave={handlePointerLeave}
          />
          <div aria-hidden="true" className="flex flex-col items-center gap-2">
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary" />
                Gets money back
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full border border-foreground/30 bg-background" />
                Pays
              </span>
            </div>
            <p className="min-h-10 text-center text-sm text-balance">{readout}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">People</span>
              <Stepper
                label="People in the group"
                value={peopleCount}
                min={minPeople}
                max={maxPeople}
                decreaseLabel="Remove one person from the group"
                increaseLabel="Add one person to the group"
                onDecrease={onRemovePerson}
                onIncrease={onAddPerson}
              />
            </div>
            <Button type="button" variant="outline" size="lg" onClick={onShuffle}>
              <Shuffle aria-hidden="true" data-icon="inline-start" />
              New receipts
            </Button>
          </div>

          <div aria-live="polite" className="flex flex-col gap-1">
            <p className="text-display-md font-medium tabular-nums">{headline}</p>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </div>

          {paymentRows.length > 0 && (
            <ol aria-label="Who pays whom" className="flex flex-col gap-2">
              <AnimatePresence initial={false} mode="popLayout">
                {paymentRows.map((row) => (
                  <motion.li
                    key={row.key}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    onPointerEnter={(event) => handlePaymentPointerEnter(row.key, event)}
                    onPointerLeave={handlePointerLeave}
                    onPointerUp={(event) => handlePaymentPointerUp(row.key, event)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded border px-3 py-2.5 text-sm transition-colors duration-300",
                      PAYMENT_ROW_CLASSES[row.state],
                    )}
                  >
                    <span>{row.label}</span>
                    <span className="shrink-0 font-medium text-primary-text tabular-nums">
                      {row.amountLabel}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          )}
        </div>
      </div>
    </BentoTile>
  );
}
