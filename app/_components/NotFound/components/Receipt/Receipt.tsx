"use client";

import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { EASE_OUT } from "@/lib/animation";
import { formatCents } from "@/lib/currency";
import {
  RECEIPT_LIST_VARIANTS,
  RECEIPT_PAYMENT_VARIANTS,
  RECEIPT_ROW_VARIANTS,
  RECEIPT_ROWS,
  RECEIPT_TOTAL_CENTS,
} from "./const";

export function Receipt() {
  return (
    <motion.section
      data-reveal
      aria-label="Receipt for this page"
      className="flex w-full max-w-sm flex-col gap-5 rounded border border-border bg-card p-6 shadow-sm md:p-8"
      initial={{ opacity: 0, y: 32, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT }}
    >
      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>Receipt</span>
        <span className="tabular-nums">No. 404</span>
      </div>

      <motion.div
        className="flex flex-col gap-5"
        variants={RECEIPT_LIST_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        <dl className="flex flex-col gap-3 border-y border-dashed border-border py-5">
          {RECEIPT_ROWS.map((row) => (
            <motion.div
              key={row.label}
              data-reveal
              variants={RECEIPT_ROW_VARIANTS}
              className="flex items-baseline justify-between gap-4"
            >
              <dt className="text-base text-muted-foreground">{row.label}</dt>
              <dd className="text-base font-medium">{row.value}</dd>
            </motion.div>
          ))}
          <motion.div
            data-reveal
            variants={RECEIPT_ROW_VARIANTS}
            className="flex items-baseline justify-between gap-4"
          >
            <dt className="text-base text-muted-foreground">Total</dt>
            <dd className="text-base font-medium">
              <AnimatedNumber
                value={RECEIPT_TOTAL_CENTS}
                format="currency"
                duration={1.6}
              />
            </dd>
          </motion.div>
          <motion.div
            data-reveal
            variants={RECEIPT_ROW_VARIANTS}
            className="flex items-baseline justify-between gap-4"
          >
            <dt className="text-base text-muted-foreground">
              Each person&apos;s share
            </dt>
            <dd className="text-base font-medium text-destructive tabular-nums">
              {formatCents(RECEIPT_TOTAL_CENTS)} ÷ 0
            </dd>
          </motion.div>
        </dl>

        <motion.div
          data-reveal
          variants={RECEIPT_ROW_VARIANTS}
          className="flex flex-col gap-2"
        >
          <h2 className="text-base font-medium">Who pays whom</h2>
          <motion.p
            data-reveal
            variants={RECEIPT_PAYMENT_VARIANTS}
            className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5"
          >
            <span className="min-w-0 text-base">This page pays you</span>
            <span className="shrink-0 text-base font-medium whitespace-nowrap text-primary-text">
              one apology
            </span>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
