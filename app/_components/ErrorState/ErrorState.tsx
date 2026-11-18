import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Logo } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/config/routes";
import type { ErrorStateProps } from "./types";

// Deliberately static: this renders after a crash, so it avoids the motion code that may have failed.
export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <>
      <header className="border-b border-border">
        <Container className="flex h-16 items-center">
          <Logo />
        </Container>
      </header>

      <main className="flex flex-1 items-center py-12 md:py-20">
        <Container className="flex max-w-2xl flex-col items-start gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-sm text-primary-text">Something went wrong</span>
            <h1 className="text-display-md font-medium text-balance">
              That didn&apos;t add up.
            </h1>
            <p className="text-lead text-muted-foreground">
              Something broke on our side, not yours. Try again, and if it keeps
              happening, start a fresh split.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="h-11 px-4" onClick={onRetry}>
              <RotateCcw aria-hidden="true" data-icon="inline-start" />
              Try again
            </Button>
            <Button
              variant="outline"
              className="h-11 px-4"
              nativeButton={false}
              render={<Link href={ROUTES.home} />}
            >
              Back to home
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
