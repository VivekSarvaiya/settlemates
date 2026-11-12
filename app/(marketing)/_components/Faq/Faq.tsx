import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { FAQS } from "./const";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-16 md:py-24">
      <Container className="grid gap-10 md:grid-cols-3 md:gap-16">
        <Reveal className="flex flex-col gap-3">
          <span className="text-sm text-primary-text">FAQ</span>
          <h2 className="text-display-md font-medium">
            Questions, answered plainly.
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col md:col-span-2">
          <dl className="flex flex-col">
            {FAQS.map((entry) => (
              <div
                key={entry.question}
                className="flex flex-col gap-2 border-t border-border py-5 first:border-t-0"
              >
                <dt className="text-base font-medium">{entry.question}</dt>
                <dd className="text-base text-muted-foreground">
                  {entry.answer}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
