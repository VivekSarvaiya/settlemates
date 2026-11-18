import type { PostHeading } from "@/lib/blog/types";

export interface TableOfContentsProps {
  headings: PostHeading[];
  variant: "collapsible" | "sidebar";
}
