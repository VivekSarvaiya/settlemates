"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/shared";
import type { HeaderProps } from "./types";
import { useHeader } from "./useHeader";

export function Header({ isBlogVisible }: HeaderProps) {
  const {
    isScrolled,
    isOpen,
    activeHref,
    ctaHref,
    navItems,
    handleToggleOpen,
    handleNavigate,
  } = useHeader({ isBlogVisible });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/0 bg-background transition-colors",
        isScrolled && "border-border",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? (item.sectionId ? "true" : "page") : undefined}
                className={cn(
                  "rounded px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            className="h-11 px-4 lg:h-9"
            nativeButton={false}
            render={<Link href={ctaHref} />}
          >
            Try it now
            <ArrowRight aria-hidden="true" data-icon="inline-end" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 lg:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={handleToggleOpen}
          >
            {isOpen ? (
              <X aria-hidden="true" />
            ) : (
              <Menu aria-hidden="true" />
            )}
          </Button>
        </div>
      </Container>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="border-b border-border bg-background lg:hidden"
          >
            <Container className="flex flex-col py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigate}
                  className="rounded px-1 py-3 text-base text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {item.label}
                </Link>
              ))}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
