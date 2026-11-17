import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { UPCOMING_MODES } from "./const";

export function ComingSoon() {
  return (
    <section
      id="coming-soon"
      className="scroll-mt-20 border-b border-border bg-muted/40 py-16 md:py-24"
    >
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <span className="text-sm text-primary-text">Coming soon</span>
          <h2 className="text-display-md font-medium">
            Trips and shared flats are next.
          </h2>
          <p className="text-lead text-muted-foreground">
            Today SettleMates splits one bill at a time. Groups that keep
            spending together are on the way.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {UPCOMING_MODES.map((mode, index) => (
            <Reveal key={mode.title} delay={index * 0.06}>
              <div className="flex h-full flex-col gap-4 rounded border border-border bg-background p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <mode.icon
                    aria-hidden="true"
                    className="size-6 text-muted-foreground"
                  />
                  <Badge variant="outline">Coming soon</Badge>
                </div>
                <h3 className="text-lg font-medium">{mode.title}</h3>
                <p className="text-base text-muted-foreground">
                  {mode.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
