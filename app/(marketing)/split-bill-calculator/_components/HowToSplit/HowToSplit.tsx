import { cn } from "cn";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BALANCE_TONE_CLASSES } from "@/components/shared/SplitCalculator/const";
import { formatCents } from "@/lib/currency";
import { HOW_TO_STEPS } from "./const";
import { buildExample } from "./example";

export function HowToSplit() {
  const { totalCents, shareCents, rows, payments } = buildExample();

  return (
    <section
      id="how-to-split"
      aria-labelledby="how-to-split-heading"
      className="scroll-mt-20 border-b border-border py-16 md:py-24"
    >
      <Container className="grid gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-sm text-primary-text">The math</span>
            <h2
              id="how-to-split-heading"
              className="text-display-md font-medium"
            >
              How to split a bill when people paid different amounts
            </h2>
            <p className="text-lead text-muted-foreground">
              Four steps. The calculator above does all of them as you type.
            </p>
          </div>

          <ol className="flex flex-col">
            {HOW_TO_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 border-t border-border py-4 first:border-t-0 first:pt-0"
              >
                <span className="text-sm text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-medium">{step.title}</h3>
                  <p className="text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.06} className="flex flex-col gap-4 self-start rounded border border-border p-6">
          <h3 className="text-lg font-medium">
            Example: dinner for {rows.length}, {formatCents(totalCents)}
          </h3>
          <p className="text-base text-muted-foreground">
            {formatCents(totalCents)} ÷ {rows.length} people ={" "}
            {formatCents(shareCents)} each.
          </p>
          <ul aria-label="Example balances" className="flex flex-col">
            {rows.map((row) => (
              <li
                key={row.name}
                className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0"
              >
                <span className="flex flex-col">
                  <span className="text-base">{row.name}</span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    paid {formatCents(row.paidCents)}
                  </span>
                </span>
                <span
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    BALANCE_TONE_CLASSES[row.balance.tone],
                  )}
                >
                  {row.balance.text}
                </span>
              </li>
            ))}
          </ul>
          <h4 className="text-base font-medium">Who pays whom</h4>
          <ul aria-label="Example payments" className="flex flex-col gap-2">
            {payments.map((payment) => (
              <li
                key={payment.key}
                className="flex items-center justify-between gap-4 rounded border border-primary/30 bg-primary/5 px-4 py-3"
              >
                <span className="text-base">{payment.label}</span>
                <span className="text-base font-medium text-primary-text tabular-nums">
                  {formatCents(payment.amountCents)}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
