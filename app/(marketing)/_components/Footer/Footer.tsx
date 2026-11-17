import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/shared";
import { ROUTES } from "@/config/routes";

const FOOTER_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Coming soon", href: "/#coming-soon" },
  { label: "FAQ", href: "/#faq" },
  { label: "Split bill calculator", href: ROUTES.splitBillCalculator },
] as const;

export function Footer() {
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

        <nav aria-label="Footer" className="flex flex-col gap-3">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="w-fit text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} SettleMates
        </p>
      </Container>
    </footer>
  );
}
