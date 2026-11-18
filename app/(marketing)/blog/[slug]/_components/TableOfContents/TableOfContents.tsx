"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import { MIN_TOC_HEADINGS } from "@/lib/blog/const";
import { TOC_LABEL } from "./const";
import type { TableOfContentsProps } from "./types";
import { useTableOfContents } from "./useTableOfContents";

export function TableOfContents({ headings, variant }: TableOfContentsProps) {
  const { activeId } = useTableOfContents(headings);

  if (headings.length < MIN_TOC_HEADINGS) return null;

  const links = (
    <ol className="flex flex-col gap-2.5 text-sm">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;
        return (
          <li key={heading.id} className={cn(heading.depth === 3 && "pl-4")}>
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block rounded transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "sidebar") {
    return (
      <nav aria-label={TOC_LABEL} className="sticky top-24 flex flex-col gap-4">
        <p className="text-sm font-medium">{TOC_LABEL}</p>
        {links}
      </nav>
    );
  }

  return (
    <details className="group rounded border border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded p-4 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
        {TOC_LABEL}
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <nav aria-label={TOC_LABEL} className="border-t border-border p-4">
        {links}
      </nav>
    </details>
  );
}
