"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "cn"
import { EASE_OUT } from "@/lib/animation"

const SEGMENT_CLASSES = [
  "bg-primary",
  "bg-primary/70",
  "bg-foreground/25",
  "bg-primary/45",
  "bg-foreground/15",
  "bg-primary/85",
  "bg-foreground/35",
  "bg-primary/30",
  "bg-foreground/10",
  "bg-primary/60",
]

type ShareBarSegment = {
  id: string
  cents: number
}

function ShareBar({
  segments,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  segments: ShareBarSegment[]
}) {
  const totalCents = segments.reduce((total, segment) => total + segment.cents, 0)

  return (
    <div
      aria-hidden="true"
      data-slot="share-bar"
      className={cn(
        "flex h-2.5 w-full gap-px overflow-hidden rounded bg-card",
        className
      )}
      {...props}
    >
      {segments.map((segment, index) => (
        <motion.div
          key={segment.id}
          className={cn("h-full", SEGMENT_CLASSES[index % SEGMENT_CLASSES.length])}
          initial={{ width: 0 }}
          animate={{
            width: totalCents > 0 ? `${(segment.cents / totalCents) * 100}%` : "0%",
          }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        />
      ))}
    </div>
  )
}

export { ShareBar, type ShareBarSegment }
