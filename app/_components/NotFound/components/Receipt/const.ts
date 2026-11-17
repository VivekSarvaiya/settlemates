import type { Variants } from "motion/react";
import { EASE_OUT } from "@/lib/animation";

export const RECEIPT_TOTAL_CENTS = 40_400;

export const RECEIPT_ROWS = [
  { label: "Page you asked for", value: "Not found" },
  { label: "Split between", value: "0 people" },
] as const;

export const RECEIPT_LIST_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.45, staggerChildren: 0.12 } },
};

export const RECEIPT_ROW_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

export const RECEIPT_PAYMENT_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 18, delay: 0.25 },
  },
};
