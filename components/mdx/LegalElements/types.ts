import type { ComponentProps, ReactNode } from "react";

export interface LegalHeadingProps {
  children?: ReactNode;
}

export type LegalParagraphProps = ComponentProps<"p">;
export type LegalListProps = ComponentProps<"ul">;
