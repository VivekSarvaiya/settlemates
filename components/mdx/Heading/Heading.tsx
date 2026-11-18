import { Hash } from "lucide-react";
import { cn } from "cn";
import { slugifyHeading, textFromNode } from "@/lib/blog/headings";
import { HEADING_LEVEL_CLASSES } from "./const";
import type { HeadingContentProps, HeadingProps } from "./types";

export function Heading({ level, children }: HeadingProps) {
  const Tag = level === 2 ? "h2" : "h3";
  const text = textFromNode(children);
  const id = slugifyHeading(text);

  return (
    <Tag
      id={id}
      className={cn(
        "group flex scroll-mt-24 items-baseline gap-2 font-medium text-balance",
        HEADING_LEVEL_CLASSES[level],
      )}
    >
      <span>{children}</span>
      <a
        href={`#${id}`}
        aria-label={`Link to section: ${text}`}
        className="rounded-sm text-muted-foreground opacity-0 transition-opacity outline-none group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Hash aria-hidden="true" className="size-4" />
      </a>
    </Tag>
  );
}

export function MdxH2({ children }: HeadingContentProps) {
  return <Heading level={2}>{children}</Heading>;
}

export function MdxH3({ children }: HeadingContentProps) {
  return <Heading level={3}>{children}</Heading>;
}
