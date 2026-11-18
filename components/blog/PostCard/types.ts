import type { PostSummary } from "@/lib/blog/types";

export interface PostCardProps {
  post: PostSummary;
  isFeatured?: boolean;
  headingLevel?: 2 | 3;
}
