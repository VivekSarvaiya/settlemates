import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/container";
import { formatCents } from "@/lib/currency";
import { SPLIT_METHODS } from "./const";

export function SplitMethods() {
  return (
    <section
      id="split-methods"
      aria-labelledby="split-methods-heading"
      className="scroll-mt-20 border-b border-border py-16 md:py-24"
    >
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <span className="text-sm text-primary-text">Split methods</span>
          <h2 id="split-methods-heading" className="text-display-md font-medium">
            Three ways to split a bill
          </h2>
          <p className="text-lead text-muted-foreground">
            Start with an equal split, then switch everyone to percentages or
            exact amounts when the bill wasn&apos;t shared evenly.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {SPLIT_METHODS.map((method, index) => (
            <Reveal key={method.title} delay={index * 0.08}>
              <article className="flex h-full flex-col gap-4 border-t border-border pt-5">
                <h3 className="text-base font-medium">{method.title}</h3>
                <p className="text-base text-muted-foreground">{method.description}</p>
                <figure className="mt-auto flex flex-col gap-3 rounded-lg border border-border p-4">
                  <figcaption className="text-sm text-muted-foreground">
                    {method.exampleCaption}
                  </figcaption>
                  <dl className="flex flex-col gap-2">
                    {method.exampleShares.map((share) => (
                      <div key={share.name} className="flex items-center justify-between gap-3">
                        <dt className="text-base">
                          {share.name}
                          {share.detail && (
                            <span className="text-muted-foreground"> · {share.detail}</span>
                          )}
                        </dt>
                        <dd className="text-base font-medium tabular-nums">
                          {formatCents(share.cents)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {method.note && (
                    <p className="text-sm text-muted-foreground">{method.note}</p>
                  )}
                </figure>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
