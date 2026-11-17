import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { FEATURES } from "./const";

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 border-b border-border py-16 md:py-24"
    >
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <span className="text-sm text-primary-text">Features</span>
          <h2 className="text-display-md font-medium">
            What it does today, and does well.
          </h2>
          <p className="text-lead text-muted-foreground">
            One bill, up to 20 people, any mix of who paid what.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={(index % 2) * 0.06}>
              <div className="flex h-full flex-col gap-4 rounded border border-border p-6 md:p-8">
                <span className="flex size-11 items-center justify-center rounded bg-primary/10">
                  <feature.icon
                    aria-hidden="true"
                    className="size-5 text-primary-text"
                  />
                </span>
                <h3 className="text-lg font-medium">{feature.title}</h3>
                <p className="text-base text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
