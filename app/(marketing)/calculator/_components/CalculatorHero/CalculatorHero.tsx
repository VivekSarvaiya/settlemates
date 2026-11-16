import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { SplitCalculator } from "@/components/shared";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/config/routes";
import { CALCULATOR_HIGHLIGHTS } from "./const";

export function CalculatorHero() {
  return (
    <section className="border-b border-border py-10 md:py-16">
      <Container className="flex flex-col gap-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link
                href={ROUTES.home}
                className="rounded transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="text-foreground">
              Split bill calculator
            </li>
          </ol>
        </nav>

        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
          <div className="flex flex-col gap-5">
            <h1 className="text-display-lg font-medium">
              Split bill calculator
            </h1>
            <p className="text-lead text-muted-foreground">
              Record who paid what and split the bill equally in seconds. Every
              share is shown in rupees, every paisa is accounted for, and the
              settlement shows who pays whom before you paste it into the group
              chat.
            </p>
            <ul className="flex flex-col gap-2.5">
              {CALCULATOR_HIGHLIGHTS.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-center gap-2.5 text-base"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary-text"
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <SplitCalculator />
        </div>
      </Container>
    </section>
  );
}
