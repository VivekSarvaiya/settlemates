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
            Splitting more than one bill?
          </h2>
          <p className="text-lead text-muted-foreground">
            Trips, flats, and regular groups need a running balance, not a
            one-off split. SettleMates tracks who paid for what and settles
            everyone up with the fewest payments.
          </p>
          <Link
            href="/#how-it-works"
            className="inline-flex items-center gap-1.5 rounded text-base font-medium text-primary-text underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            See how SettleMates works
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
