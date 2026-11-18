import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbProps } from "./types";

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.label} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />}
            {item.href ? (
              <Link
                href={item.href}
                className="rounded transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="line-clamp-1 text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
