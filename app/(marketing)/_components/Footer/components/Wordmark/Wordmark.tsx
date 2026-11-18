"use client";

import { motion } from "motion/react";
import { LETTER_VARIANTS, WORDMARK_VARIANTS, WORDMARK_VIEWPORT } from "./const";
import type { WordmarkProps } from "./types";
import { useWordmark } from "./useWordmark";

export function Wordmark({ text }: WordmarkProps) {
  const { letters, handlePointerMove } = useWordmark({ text });

  return (
    <div aria-hidden="true" className="@container select-none">
      <div
        onPointerMove={handlePointerMove}
        className="group/wordmark relative overflow-hidden"
      >
        <motion.p
          className="-mb-[0.2em] flex justify-between text-[18cqw] leading-none font-semibold tracking-tight"
          variants={WORDMARK_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={WORDMARK_VIEWPORT}
        >
          {letters.map((letter, index) => (
            <span key={index} className="overflow-hidden">
              <motion.span
                data-reveal
                variants={LETTER_VARIANTS}
                className="block bg-linear-to-b from-foreground/20 to-foreground/3 bg-clip-text text-transparent"
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </motion.p>
        <p className="pointer-events-none absolute inset-x-0 top-0 flex justify-between text-[18cqw] leading-none font-semibold tracking-tight text-primary opacity-0 transition-opacity duration-500 [mask-image:radial-gradient(circle_16rem_at_var(--spot-x,50%)_var(--spot-y,50%),black,transparent_75%)] group-hover/wordmark:opacity-100">
          {letters.map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </p>
      </div>
    </div>
  );
}
