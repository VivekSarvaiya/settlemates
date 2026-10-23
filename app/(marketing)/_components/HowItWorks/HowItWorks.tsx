import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { STEPS } from "./const";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-b border-border py-16 md:py-24"
    >
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <span className="text-sm text-primary-text">How it works</span>
          <h2 className="text-display-md font-medium">
            Three steps, start to settled.
          </h2>
          <p className="text-lead text-muted-foreground">
            The whole flow is built to be understood without instructions —
            enter a number, adjust the shares, hand the answer to the group.
          </p>
        </Reveal>

        <ol className="grid gap-8 md:grid-cols-3 md:gap-10">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 border-t border-border pt-5"
            >
              <Reveal delay={index * 0.08} className="flex flex-col gap-3">
                <span className="text-sm text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-medium">{step.title}</h3>
                <p className="text-base text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
