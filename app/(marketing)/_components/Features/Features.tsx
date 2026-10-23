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
            Everything the bill needs, nothing it doesn&apos;t.
          </h2>
          <p className="text-lead text-muted-foreground">
            SettleMates replaces the group-chat spreadsheet with one number
            everybody can check.
          </p>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={(index % 3) * 0.08}>
              <div className="flex h-full flex-col gap-3 border-t border-border pt-5">
                <feature.icon
                  aria-hidden="true"
                  className="size-5 text-primary-text"
                />
                <h3 className="text-base font-medium">{feature.title}</h3>
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
