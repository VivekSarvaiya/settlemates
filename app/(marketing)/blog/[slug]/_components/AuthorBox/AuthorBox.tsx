import Link from "next/link";
import { AuthorAvatar } from "@/components/blog";
import { authorPath } from "@/config/routes";
import type { AuthorBoxProps } from "./types";

export function AuthorBox({ author }: AuthorBoxProps) {
  return (
    <section
      aria-label="About the author"
      className="flex flex-col gap-4 rounded border border-border p-6 sm:flex-row"
    >
      <AuthorAvatar author={author} size="lg" />
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Written by</p>
        <p className="text-base font-medium">
          {author.name}, <span className="font-normal text-muted-foreground">{author.role}</span>
        </p>
        <p className="text-base text-muted-foreground">{author.bio}</p>
        <Link
          href={authorPath(author.id)}
          className="w-fit rounded text-sm text-primary-text underline underline-offset-4 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          More about the author
        </Link>
      </div>
    </section>
  );
}
