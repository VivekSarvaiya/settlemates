import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ROUTES } from "@/config/routes";
import { Receipt, StatusMark } from "./components";

export function NotFound() {
  return (
    <>
      <header className="border-b border-border">
        <Container className="flex h-16 items-center">
          <Logo />
        </Container>
      </header>

      <main className="flex flex-1 items-center py-12 md:py-20">
        <Container className="grid items-center gap-12 md:grid-cols-2 md:gap-14">
          <div className="flex flex-col items-start gap-6">
            <StatusMark />
            <Reveal delay={0.15} className="flex flex-col gap-3">
              <span className="text-sm text-primary-text">Page not found</span>
              <h1 className="text-display-md font-medium text-balance">
                This page skipped out on the bill.
              </h1>
              <p className="text-lead text-muted-foreground">
                The link may be mistyped, or the page has moved. The calculator
                is right where you left it.
              </p>
            </Reveal>
            <Reveal delay={0.25} className="flex flex-wrap gap-3">
              <Button
                className="h-11 px-4"
                nativeButton={false}
                render={<Link href={ROUTES.splitBillCalculator} />}
              >
                Split a bill
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                className="h-11 px-4"
                nativeButton={false}
                render={<Link href={ROUTES.home} />}
              >
                Back to home
              </Button>
            </Reveal>
          </div>

          <div className="flex justify-center md:justify-end">
            <Receipt />
          </div>
        </Container>
      </main>
    </>
  );
}
