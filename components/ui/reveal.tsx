"use client"

import * as React from "react"
import { motion } from "motion/react"
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/animation"

function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      data-slot="reveal"
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.45, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

export { Reveal }
