import { CircleCheck } from "lucide-react";
import { UPCOMING_MODES } from "@/app/(marketing)/_components/ComingSoon/const";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { WORKS_TODAY } from "./const";

export function Roadmap() {
  return (
    <section
      aria-labelledby="roadmap-heading"
      className="border-b border-border bg-muted/40 py-16 md:py-24"
    >
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <span className="text-sm text-primary-text">Where it stands</span>
          <h2 id="roadmap-heading" className="text-display-md font-medium">
            One bill at a time, for now.
          </h2>
          <p className="text-lead text-muted-foreground">
            Trips and shared flats are next. They&apos;ll appear here when they&apos;re
            ready, not before.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col gap-5 rounded border border-border bg-background p-6 md:p-8">
              <h3 className="text-lg font-medium">Works today</h3>
              <ul className="flex flex-col gap-3">
                {WORKS_TODAY.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base">
                    <CircleCheck
                      aria-hidden="true"
                      className="mt-0.5 size-5 shrink-0 text-primary-text"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="flex h-full flex-col gap-5 rounded border border-border bg-background p-6 md:p-8">
              <h3 className="text-lg font-medium">Coming next</h3>
              <ul className="flex flex-col gap-6">
                {UPCOMING_MODES.map((mode) => (
                  <li key={mode.title} className="flex items-start gap-4">
                    <mode.icon
                      aria-hidden="true"
                      className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                    />
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-medium">{mode.title}</p>
                        <Badge variant="outline">Coming soon</Badge>
                      </div>
                      <p className="text-base text-muted-foreground">{mode.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
