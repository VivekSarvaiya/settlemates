import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SplitCalculator } from "@/components/shared";
import { Reveal } from "@/components/ui/reveal";
import { ROUTES } from "@/config/routes";

export function Hero() {
  return (
    <section className="border-b border-border py-14 md:py-20">
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <Reveal className="flex flex-col items-start gap-5">
          <Badge variant="outline">No sign-up needed</Badge>
          <h1 className="text-display-lg font-medium">
            Split expenses, not friendships.
          </h1>
          <p className="text-lead text-muted-foreground">
            Track shared expenses, split bills any way you like, and settle up
            with the fewest payments possible. No spreadsheets, no mental math.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              className="h-12 px-5 text-base"
              nativeButton={false}
              render={<Link href={ROUTES.splitBillCalculator} />}
            >
              Try the calculator
              <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              className="h-12 px-5 text-base"
              nativeButton={false}
              render={<a href="#how-it-works" />}
            >
              How it works
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="w-full">
          <SplitCalculator />
        </Reveal>
      </Container>
    </section>
  );
}
