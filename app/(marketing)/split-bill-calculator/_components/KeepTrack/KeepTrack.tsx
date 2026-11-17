import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/container";

export function KeepTrack() {
  return (
    <section aria-labelledby="keep-track-heading" className="py-16 md:py-24">
      <Container>
        <Reveal className="flex max-w-2xl flex-col items-start gap-4">
          <h2 id="keep-track-heading" className="text-display-md font-medium">
            Splitting a whole trip or a shared flat?
          </h2>
          <p className="text-lead text-muted-foreground">
            Trip groups and shared living, with running balances and monthly
            reports, are coming soon. For now, add up what each person paid
            and split it here.
          </p>
          <Link
            href="/#coming-soon"
            className="inline-flex items-center gap-1.5 rounded text-base font-medium text-primary-text underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            See what&apos;s coming
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
