"use client";

import { CircleCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/animation";
import { FEATURES } from "../../const";
import { BentoTile } from "../BentoTile/BentoTile";
import { Stepper } from "../Stepper/Stepper";
import { TileHeader } from "../TileHeader/TileHeader";
import { usePaisaTile } from "./usePaisaTile";

export function PaisaTile() {
  const {
    titleId,
    billOptions,
    peopleCount,
    minPeople,
    maxPeople,
    rows,
    totalLabel,
    leftoverNote,
    handleBillSelect,
    handleAddPerson,
    handleRemovePerson,
  } = usePaisaTile();

  return (
    <BentoTile labelledBy={titleId}>
      <TileHeader id={titleId} feature={FEATURES.paisa} />

      <div className="mt-auto flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Bill amount" className="flex gap-1.5">
            {billOptions.map((option) => (
              <Button
                key={option.cents}
                type="button"
                size="sm"
                variant={option.isSelected ? "default" : "outline"}
                aria-pressed={option.isSelected}
                onClick={() => handleBillSelect(option.cents)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Stepper
            label="People sharing the bill"
            value={peopleCount}
            min={minPeople}
            max={maxPeople}
            decreaseLabel="Split the bill between fewer people"
            increaseLabel="Split the bill between more people"
            onDecrease={handleRemovePerson}
            onIncrease={handleAddPerson}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border bg-muted/40 p-4">
          <ul aria-label="Shares" className="flex flex-col">
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.li
                  key={row.name}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
                    <span className="flex items-center gap-2">
                      {row.name}
                      {row.hasExtra && (
                        <Badge
                          variant="outline"
                          className="border-primary/30 text-primary-text"
                        >
                          +1 paisa
                        </Badge>
                      )}
                    </span>
                    <motion.span
                      key={row.amountLabel}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                      className={cn(
                        "tabular-nums",
                        row.hasExtra && "font-medium text-primary-text",
                      )}
                    >
                      {row.amountLabel}
                    </motion.span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="flex items-center justify-between gap-3 border-t border-dashed border-border pt-3 text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <CircleCheck aria-hidden="true" className="size-4 text-primary-text" />
              Adds up to
            </span>
            <span className="tabular-nums">{totalLabel}</span>
          </div>
        </div>

        <p aria-live="polite" className="text-sm text-muted-foreground">
          {leftoverNote}
        </p>
      </div>
    </BentoTile>
  );
}
