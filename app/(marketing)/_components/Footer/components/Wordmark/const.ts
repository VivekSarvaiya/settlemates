import type { Variants } from "motion/react";
import { EASE_OUT } from "@/lib/animation";

export const WORDMARK_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

export const LETTER_VARIANTS: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: EASE_OUT } },
};

export const WORDMARK_VIEWPORT = { once: true, amount: 0.5 } as const;
