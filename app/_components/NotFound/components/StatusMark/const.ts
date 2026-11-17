import type { Transition } from "motion/react";
import { EASE_OUT } from "@/lib/animation";

export const DIGIT_SLIDE = {
  offset: 24,
  transition: { duration: 0.5, ease: EASE_OUT } satisfies Transition,
};

export const COIN_DROP = {
  offset: 48,
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 14,
    delay: 0.2,
  } satisfies Transition,
};

export const COIN_FLIP: Transition = {
  duration: 1.2,
  ease: "easeInOut",
  delay: 1,
  repeat: Infinity,
  repeatDelay: 2.8,
};
