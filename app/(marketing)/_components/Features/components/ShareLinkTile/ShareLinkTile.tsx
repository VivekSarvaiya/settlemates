"use client";

import { ArrowUpRight, Check, Copy, Lock } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/animation";
import { FEATURES } from "../../const";
import { BentoTile } from "../BentoTile/BentoTile";
import { TileHeader } from "../TileHeader/TileHeader";
import type { ShareLinkTileProps } from "./types";
import { useShareLinkTile } from "./useShareLinkTile";

export function ShareLinkTile({ group, siteHost }: ShareLinkTileProps) {
  const {
    titleId,
    path,
    hashPrefix,
    encoded,
    href,
    previewRows,
    hiddenPaymentCount,
    preview,
    isCopied,
    statusMessage,
    handleCopy,
  } = useShareLinkTile({ group });

  return (
    <BentoTile labelledBy={titleId}>
      <TileHeader id={titleId} feature={FEATURES.shareLink} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-muted/40">
          <div aria-hidden="true" className="flex gap-1.5 px-3 py-2.5">
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
          </div>
          <div className="relative flex items-center gap-2 overflow-hidden border-t border-border bg-background px-3 py-2.5 text-sm">
            <Lock aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
            <p className="min-w-0 truncate">
              <span>
                {siteHost}
                {path}
              </span>
              <span className="text-primary-text">{hashPrefix}</span>
              <motion.span
                key={encoded}
                className="text-muted-foreground"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {encoded}
              </motion.span>
            </p>
            <motion.span
              key={`sweep:${encoded}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent via-primary/15 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "500%" }}
              transition={{ duration: 0.9, ease: EASE_OUT }}
            />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2 border-t border-border bg-background p-4">
            <p className="text-xs font-medium text-muted-foreground">Who pays whom</p>
            {previewRows.length > 0 ? (
              <ul aria-label="Split the link opens" className="flex flex-col gap-1.5 text-sm">
                {previewRows.map((row) => (
                  <li key={row.key} className="flex justify-between gap-3">
                    <span>{row.label}</span>
                    <span className="font-medium text-primary-text tabular-nums">
                      {row.amountLabel}
                    </span>
                  </li>
                ))}
                {hiddenPaymentCount > 0 && (
                  <li className="text-muted-foreground">+{hiddenPaymentCount} more</li>
                )}
              </ul>
            ) : (
              <p className="text-sm">Everyone&apos;s square.</p>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{preview}</p>

        <div className="flex flex-wrap gap-2">
          <Button type="button" size="lg" className="px-4" onClick={handleCopy}>
            {isCopied ? (
              <Check aria-hidden="true" data-icon="inline-start" />
            ) : (
              <Copy aria-hidden="true" data-icon="inline-start" />
            )}
            {isCopied ? "Copied" : "Copy link"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-4"
            nativeButton={false}
            render={<a href={href} />}
          >
            Open this split
            <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
          </Button>
        </div>
        <p aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
          {statusMessage}
        </p>
      </div>
    </BentoTile>
  );
}
