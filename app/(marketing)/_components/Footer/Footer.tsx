import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/shared";
import { SITE_NAME } from "@/config/site";
import { FOOTER_LINK_GROUPS } from "./const";
import type { FooterProps } from "./types";

export function Footer({ isBlogVisible }: FooterProps) {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-xs flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Split a bill in seconds, with no sign-up and no app. Trips and
            shared flats are coming soon.
          </p>
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

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </Container>
    </footer>
  );
}
