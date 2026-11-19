"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { SplitCalculatorCard } from "@/components/shared";
import { EASE_OUT } from "@/lib/animation";
import { HERO_HOOKS } from "./const";
import { useHero } from "./useHero";

export function Hero() {
  const { calculator, headline } = useHero();

  return (
    <section
      id="quick-split"
      className="relative scroll-mt-16 border-b border-border py-10 md:py-20"
    >
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--primary"
        glowColorLightVar="--primary"
        colorDarkVar="--primary"
        glowColorDarkVar="--primary"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />

      <Container className="relative z-10 grid items-start gap-8 md:grid-cols-2 md:gap-14">
        <div className="flex flex-col items-start gap-5 md:sticky md:top-28">
          <ul
            aria-label="Why SettleMates"
            className="flex flex-wrap gap-x-4 gap-y-2"
          >
            {HERO_HOOKS.map((hook) => (
              <li
                key={hook}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Check aria-hidden="true" className="size-4 text-primary-text" />
                {hook}
              </li>
            ))}
          </ul>
          <h1 className="text-display-lg font-medium text-balance">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={headline.key}
                className="block"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                {headline.before}
                {headline.amount && (
                  <span className="whitespace-nowrap">
                    <span className="text-primary-text tabular-nums">
                      {headline.amount}
                    </span>
                    .
                  </span>
                )}
              </motion.span>
            </AnimatePresence>
          </h1>
          <p className="text-lead text-muted-foreground">{headline.detail}</p>
        </div>

        <SplitCalculatorCard calculator={calculator} />
      </Container>
    </section>
  );
}
