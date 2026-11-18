"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "cn";
import { EASE_OUT } from "@/lib/animation";
import { AVATAR_TONE_CLASSES } from "../../const";
import {
  EDGE_DRAW_DELAY,
  EDGE_DRAW_DURATION,
  EDGE_STAGGER,
  NODE_HIDDEN,
} from "./const";
import type { SettlementGraphProps } from "./types";

const percent = (value: number) => `${value}%`;

export function SettlementGraph({
  graphRef,
  markerId,
  isInView,
  nodes,
  edges,
  onPersonPointerEnter,
  onPersonPointerUp,
  onPointerLeave,
}: SettlementGraphProps) {
  return (
    <div
      ref={graphRef}
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-88 select-none"
    >
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[14px_14px] [mask-image:radial-gradient(circle_closest-side,black_55%,transparent)]" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-primary" />
          </marker>
        </defs>
        {edges.map((edge, index) => {
          const delay = EDGE_DRAW_DELAY + index * EDGE_STAGGER;

          return (
            <g
              key={edge.key}
              className={cn(
                "transition-opacity duration-300",
                edge.isActive ? "opacity-100" : "opacity-15",
              )}
            >
              <motion.path
                d={edge.path}
                fill="none"
                strokeWidth={0.7}
                strokeLinecap="round"
                className="stroke-primary/25"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : undefined}
                transition={{ duration: EDGE_DRAW_DURATION, delay, ease: EASE_OUT }}
              />
              <motion.path
                data-reveal
                d={edge.path}
                fill="none"
                strokeWidth={0.7}
                strokeLinecap="round"
                strokeDasharray="1.5 3"
                markerEnd={`url(#${markerId})`}
                className="stroke-primary motion-safe:animate-dash-flow"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.3, delay: delay + EDGE_DRAW_DURATION * 0.7 }}
              />
            </g>
          );
        })}
      </svg>

      {edges.map((edge, index) => (
        <span
          key={edge.key}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
            edge.isActive ? "opacity-100" : "opacity-15",
          )}
          style={{ left: percent(edge.labelPoint.x), top: percent(edge.labelPoint.y) }}
        >
          <motion.span
            data-reveal
            className="block rounded-full border border-primary/30 bg-background px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary-text tabular-nums shadow-xs"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={isInView ? { opacity: 1, scale: 1 } : undefined}
            transition={{
              duration: 0.35,
              delay: EDGE_DRAW_DELAY + index * EDGE_STAGGER + EDGE_DRAW_DURATION,
              ease: EASE_OUT,
            }}
          >
            {edge.amountLabel}
          </motion.span>
        </span>
      ))}

      <AnimatePresence initial={false}>
        {nodes.map((node, index) => (
          <motion.div
            key={node.key}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            initial={NODE_HIDDEN}
            animate={{
              left: percent(node.point.x),
              top: percent(node.point.y),
              opacity: 1,
              scale: 1,
            }}
            exit={NODE_HIDDEN}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            onPointerEnter={(event) => onPersonPointerEnter(index, event)}
            onPointerLeave={onPointerLeave}
            onPointerUp={(event) => onPersonPointerUp(index, event)}
          >
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-full border text-sm font-medium shadow-xs transition-[opacity,box-shadow] duration-300",
                AVATAR_TONE_CLASSES[node.tone],
                node.isActive ? "opacity-100" : "opacity-30",
                node.isSelected && "ring-4 ring-primary/25",
              )}
            >
              {node.initial}
            </span>
          </motion.div>
        ))}
        {nodes.map((node) => (
          <motion.span
            key={`name:${node.key}`}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            initial={NODE_HIDDEN}
            animate={{
              left: percent(node.namePoint.x),
              top: percent(node.namePoint.y),
              opacity: 1,
              scale: 1,
            }}
            exit={NODE_HIDDEN}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <span
              className={cn(
                "block text-xs whitespace-nowrap text-muted-foreground transition-opacity duration-300",
                node.isActive ? "opacity-100" : "opacity-30",
              )}
            >
              {node.name}
            </span>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
