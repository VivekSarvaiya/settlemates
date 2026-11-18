import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/config/routes";
import { SITE_NAME } from "@/config/site";
import { Wordmark } from "./components";
import { FOOTER_LINK_GROUPS } from "./const";
import type { FooterProps } from "./types";

export function Footer({ isBlogVisible }: FooterProps) {
  return (
    <footer className="overflow-hidden border-t border-border">
      <Container className="flex flex-col gap-12 pt-14 md:pt-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-xs flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Split a bill in seconds, with no sign-up and no app. Trips and
              shared flats are coming soon.
            </p>
            <Button
              className="h-10 w-fit px-4"
              nativeButton={false}
              render={<Link href={ROUTES.splitBillCalculator} />}
            >
              Split a bill
              <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </Button>
          </div>

          <nav aria-label="Footer" className="flex gap-12 md:gap-16">
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-3">
                <p className="text-sm font-medium">{group.label}</p>
                {group.links
                  .filter((link) => isBlogVisible || !link.isBlogLink)
                  .map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="w-fit text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {link.label}
                    </Link>
                  ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p>Split expenses, not friendships.</p>
        </div>

        <Wordmark text={SITE_NAME} />
      </Container>
    </footer>
  );
}
