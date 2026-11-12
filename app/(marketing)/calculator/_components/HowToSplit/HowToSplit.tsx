import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/container";
import { HOW_TO_STEPS } from "./const";

export function HowToSplit() {
  return (
    <section
      id="how-to-split"
      aria-labelledby="how-to-split-heading"
      className="scroll-mt-20 border-b border-border py-16 md:py-24"
    >
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <span className="text-sm text-primary-text">How to use it</span>
          <h2 id="how-to-split-heading" className="text-display-md font-medium">
            How to split a bill with the calculator
          </h2>
        </Reveal>

        <ol className="grid gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-4">
          {HOW_TO_STEPS.map((step, index) => (
            <li key={step.title} className="border-t border-border pt-5">
              <Reveal delay={index * 0.08} className="flex flex-col gap-3">
                <span className="text-sm text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-medium">{step.title}</h3>
                <p className="text-base text-muted-foreground">{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
