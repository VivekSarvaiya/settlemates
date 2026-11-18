import { CheckCircle2 } from "lucide-react";
import { Breadcrumb, SplitCalculator } from "@/components/shared";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/config/routes";
import { CALCULATOR_PAGE } from "../../_lib/const";
import { CALCULATOR_HIGHLIGHTS } from "./const";

export function CalculatorHero() {
  return (
    <section
      id="quick-split"
      className="scroll-mt-16 border-b border-border py-8 md:py-16"
    >
      <Container className="flex flex-col gap-6 md:gap-8">
        <Breadcrumb
          items={[
            { label: "Home", href: ROUTES.home },
            { label: CALCULATOR_PAGE.breadcrumb },
          ]}
        />

        <div className="flex flex-col gap-8 md:grid md:grid-cols-2 md:items-start md:gap-14">
          <div className="contents md:flex md:flex-col md:gap-8">
            <div className="order-1 flex flex-col gap-4">
              <h1 className="text-display-lg font-medium text-balance">
                Split bill calculator
              </h1>
              <p className="text-lead text-muted-foreground">
                Type what each person paid. You get everyone&apos;s equal share
                and the exact payments that settle the group, down to the
                paisa.
              </p>
            </div>

            <ul className="order-3 flex flex-col gap-2.5">
              {CALCULATOR_HIGHLIGHTS.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2.5 text-base"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-primary-text"
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-2 md:order-none">
            <SplitCalculator />
          </div>
        </div>
      </Container>
    </section>
  );
}
