import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PRINCIPLES } from "./const";

export function Principles() {
  return (
    <section aria-labelledby="principles-heading" className="border-b border-border py-16 md:py-24">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <span className="text-sm text-primary-text">What we care about</span>
          <h2 id="principles-heading" className="text-display-md font-medium">
            A small tool with strong opinions.
          </h2>
        </Reveal>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.05}>
              <div className="flex h-full flex-col gap-3 border-t border-foreground pt-6">
                <principle.icon aria-hidden="true" className="size-5 text-primary-text" />
                <h3 className="text-lg font-medium">{principle.title}</h3>
                <p className="text-base text-muted-foreground">{principle.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
