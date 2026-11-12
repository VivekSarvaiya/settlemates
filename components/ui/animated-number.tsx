"use client"

import * as React from "react"
import { animate, useInView, useReducedMotion } from "motion/react"
import { cn } from "cn"
import { EASE_OUT } from "@/lib/animation"
import { formatCents } from "@/lib/currency"

function AnimatedNumber({
  value,
  format = "integer",
  duration = 1.1,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  value: number
  format?: "integer" | "currency"
  duration?: number
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })
  const prefersReducedMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = React.useState(0)
  const lastValueRef = React.useRef(0)

  React.useEffect(() => {
    if (!isInView || prefersReducedMotion) return

    const controls = animate(lastValueRef.current, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        lastValueRef.current = latest
        setDisplayValue(latest)
      },
    })
    return () => controls.stop()
  }, [isInView, value, duration, prefersReducedMotion])

  const rounded = prefersReducedMotion ? value : Math.round(displayValue)
  const text =
    format === "currency" ? formatCents(rounded) : rounded.toLocaleString("en-IN")

  return (
    <span
      ref={ref}
      data-slot="animated-number"
      className={cn("tabular-nums", className)}
      {...props}
    >
      {text}
    </span>
  )
}

export { AnimatedNumber }
