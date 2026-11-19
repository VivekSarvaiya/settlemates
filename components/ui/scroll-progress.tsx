"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionProps,
} from "motion/react";

import { cn } from "@/lib/utils";

interface ScrollProgressProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
> {
  ref?: React.Ref<HTMLDivElement>;
  targetId?: string;
}

export function ScrollProgress({
  className,
  ref,
  targetId,
  ...props
}: ScrollProgressProps) {
  const { scrollY, scrollYProgress } = useScroll();
  // With a target, fill from the top of the page until the target's end reaches the bottom of the screen.
  // scrollYProgress is an input too, so a resize (which changes it but not scrollY) re-measures.
  const scaleX = useTransform(
    [scrollY, scrollYProgress],
    ([y, pageProgress]: number[]) => {
      const target =
        targetId && typeof document !== "undefined"
          ? document.getElementById(targetId)
          : null;
      if (!target) return pageProgress;
      if (y <= 0) return 0;
      // Live window.scrollY, not y: right after a route change y can lag the page being measured.
      const end =
        target.getBoundingClientRect().bottom +
        window.scrollY -
        window.innerHeight;
      return end > 0 ? Math.min(y / end, 1) : 1;
    },
  );

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-px origin-left bg-linear-to-r from-primary via-primary-text to-primary-text",
        className,
      )}
      style={{
        scaleX,
      }}
      {...props}
    />
  );
}
