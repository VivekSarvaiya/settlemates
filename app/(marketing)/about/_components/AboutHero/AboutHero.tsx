import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/config/routes";
import { ABOUT_FACTS, ABOUT_HERO } from "./const";
import type { AboutHeroProps } from "./types";

export function AboutHero({ hasGuides }: AboutHeroProps) {
  return (
    <section className="border-b border-border py-10 md:py-20">
      <Container className="flex flex-col gap-10 lg:grid lg:grid-cols-5 lg:items-end lg:gap-14">
        <div className="flex flex-col items-start gap-5 lg:col-span-3">
          <Breadcrumb items={[{ label: "Home", href: ROUTES.home }, { label: "About" }]} />
          <span className="text-sm text-primary-text">{ABOUT_HERO.eyebrow}</span>
          <h1 className="text-display-lg font-medium text-balance">{ABOUT_HERO.heading}</h1>
          <p className="max-w-2xl text-lead text-muted-foreground">{ABOUT_HERO.lead}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              className="h-11 px-4"
              nativeButton={false}
              render={<Link href={ROUTES.splitBillCalculator} />}
            >
              Try the calculator
              <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </Button>
            {hasGuides && (
              <Button
                variant="outline"
                className="h-11 px-4"
                nativeButton={false}
                render={<Link href={ROUTES.blog} />}
              >
                Read the guides
              </Button>
            )}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded border border-border bg-border lg:col-span-2">
          {ABOUT_FACTS.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1 bg-background p-5 md:p-6">
              <dt className="order-2 text-sm text-muted-foreground">{fact.label}</dt>
              <dd className="order-1 text-display-md font-medium tabular-nums">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
