import { ArrowDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { formatCents } from "@/lib/currency";
import { buildExample } from "./example";

export function HowItWorks() {
  const {
    people,
    totalCents,
    shareCents,
    payments,
    squareNames,
    peopleWord,
    paymentsWord,
    paymentsWordLower,
    paymentsNoun,
    squareVerb,
  } = buildExample();

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-b border-border py-16 md:py-24"
    >
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <span className="text-sm text-primary-text">How it works</span>
          <h2 className="text-display-md font-medium">
            {peopleWord} friends. One Goa weekend. {paymentsWord}{" "}
            {paymentsNoun} to settle it.
          </h2>
          <p className="text-lead text-muted-foreground">
            Everyone paid for something. Type in what each person paid and
            SettleMates works out who pays whom: {paymentsWordLower}{" "}
            {paymentsNoun} and everyone is square.
          </p>
        </Reveal>

        <Reveal className="flex flex-col items-stretch gap-6 md:flex-row md:items-center md:gap-8">
          <div className="flex flex-col gap-4 rounded border border-border p-6 md:flex-1">
            <h3 className="text-base font-medium">Who paid what</h3>
            <ul aria-label="Who paid what" className="flex flex-col">
              {people.map((person) => (
                <li
                  key={person.name}
                  className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="text-base">{person.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {person.paidFor}
                    </span>
                  </span>
                  <span className="shrink-0 text-base tabular-nums">
                    {formatCents(person.paidCents)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground tabular-nums">
              {formatCents(totalCents)} in total, {formatCents(shareCents)} each.
            </p>
          </div>

          <div className="flex justify-center text-primary-text">
            <ArrowDown aria-hidden="true" className="size-6 md:hidden" />
            <ArrowRight aria-hidden="true" className="hidden size-6 md:block" />
          </div>

          <div className="flex flex-col gap-4 rounded border border-primary/30 bg-primary/5 p-6 md:flex-1">
            <h3 className="text-base font-medium">Who pays whom</h3>
            <ul aria-label="Who pays whom" className="flex flex-col gap-2">
              {payments.map((payment) => (
                <li
                  key={payment.key}
                  className="flex items-center justify-between gap-4 rounded border border-border bg-background px-4 py-3"
                >
                  <span className="text-base">{payment.label}</span>
                  <span className="shrink-0 text-base font-medium text-primary-text tabular-nums">
                    {formatCents(payment.amountCents)}
                  </span>
                </li>
              ))}
            </ul>
            {squareNames.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {squareNames.join(" and ")} already paid their share and{" "}
                {squareVerb} nothing more to pay.
              </p>
            )}
            <a
              href="#quick-split"
              className="inline-flex w-fit items-center gap-1.5 rounded text-base font-medium text-primary-text underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Try it with your own group
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
