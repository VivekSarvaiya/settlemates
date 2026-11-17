"use client";

import { motion } from "motion/react";
import { COIN_DROP, COIN_FLIP, DIGIT_SLIDE } from "./const";

export function StatusMark() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-1 text-display-lg font-medium tabular-nums md:gap-2"
    >
      <motion.span
        data-reveal
        initial={{ opacity: 0, x: -DIGIT_SLIDE.offset }}
        animate={{ opacity: 1, x: 0 }}
        transition={DIGIT_SLIDE.transition}
      >
        4
      </motion.span>
      <motion.span
        data-reveal
        className="perspective-normal"
        initial={{ opacity: 0, y: -COIN_DROP.offset }}
        animate={{ opacity: 1, y: 0 }}
        transition={COIN_DROP.transition}
      >
        <motion.span
          className="grid size-9 place-items-center rounded-full bg-primary text-base text-primary-foreground ring-4 ring-primary/15 md:size-12 lg:size-14 lg:text-lg"
          animate={{ rotateY: [0, 360] }}
          transition={COIN_FLIP}
        >
          ₹
        </motion.span>
      </motion.span>
      <motion.span
        data-reveal
        initial={{ opacity: 0, x: DIGIT_SLIDE.offset }}
        animate={{ opacity: 1, x: 0 }}
        transition={DIGIT_SLIDE.transition}
      >
        4
      </motion.span>
    </div>
  );
}
