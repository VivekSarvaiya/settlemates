import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QUICK_LINKS } from "./const";

export function QuickLinks() {
  return (
    <nav aria-labelledby="quick-links-heading" className="flex flex-col gap-4">
      <h2 id="quick-links-heading" className="text-lg font-medium">
        Quick links
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex h-full items-start justify-between gap-3 rounded border border-border bg-background p-5 transition-colors outline-none hover:border-foreground/25 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="flex flex-col gap-1">
                <span className="text-base font-medium">{link.label}</span>
                <span className="text-sm text-muted-foreground">{link.description}</span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
