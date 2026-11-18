import type { Author, PostSummary } from "@/lib/blog/types";

export interface PostHeaderProps {
  post: PostSummary;
  author: Author;
}
