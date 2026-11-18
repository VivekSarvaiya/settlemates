import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { env } from "@/config/env";
import { BentoGrid } from "./components";

export function Features() {
  const siteOrigin = new URL(env.SITE_URL).origin;

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
            One bill, up to 20 people, any mix of who paid what. Every tile
            below runs the same engine as the calculator, so go ahead and play.
          </p>
        </Reveal>

        <BentoGrid siteOrigin={siteOrigin} />
      </Container>
    </section>
  );
}
