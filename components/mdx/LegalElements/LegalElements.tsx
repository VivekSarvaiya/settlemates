import { slugifyHeading, textFromNode } from "@/lib/blog/headings";
import type { LegalHeadingProps, LegalListProps, LegalParagraphProps } from "./types";

export function LegalHeading({ children }: LegalHeadingProps) {
  return (
    <h2
      id={slugifyHeading(textFromNode(children))}
      className="mt-6 scroll-mt-24 border-t border-border pt-8 text-lg font-medium first:mt-0 first:border-t-0 first:pt-0"
    >
      {children}
    </h2>
  );
}

export function LegalParagraph({ children }: LegalParagraphProps) {
  return <p className="text-base">{children}</p>;
}

export function LegalList({ children }: LegalListProps) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-base marker:text-muted-foreground">
      {children}
    </ul>
  );
}
