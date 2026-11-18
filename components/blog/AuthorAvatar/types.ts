import type { Author } from "@/lib/blog/types";

export interface AuthorAvatarProps {
  author: Author;
  size?: "default" | "lg";
}
