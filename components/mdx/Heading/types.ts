import type { ReactNode } from "react";

export interface HeadingContentProps {
  children?: ReactNode;
}

export interface HeadingProps extends HeadingContentProps {
  level: 2 | 3;
}
