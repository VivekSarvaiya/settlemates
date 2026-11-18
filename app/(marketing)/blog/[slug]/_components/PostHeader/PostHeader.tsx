import Link from "next/link";
import { AuthorAvatar } from "@/components/blog";
import { Breadcrumb } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { ROUTES, authorPath } from "@/config/routes";
import { formatPostDate, formatReadingTime } from "@/lib/blog/format";
import type { PostHeaderProps } from "./types";

export function PostHeader({ post, author }: PostHeaderProps) {
  const { meta } = post;
  const isUpdated = Boolean(meta.updatedAt && meta.updatedAt !== meta.publishedAt);

  return (
    <header className="flex max-w-3xl flex-col gap-5">
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.home },
          { label: "Blog", href: ROUTES.blog },
          { label: meta.title },
        ]}
      />
      <div className="flex items-center gap-2">
        <Badge variant="outline">{meta.category}</Badge>
        {meta.draft && <Badge variant="destructive">Draft</Badge>}
      </div>
      <h1 className="text-display-lg font-medium text-balance">{meta.title}</h1>
      <p className="text-lead text-muted-foreground">{meta.description}</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1 text-sm text-muted-foreground">
        <Link
          href={authorPath(author.id)}
          className="flex items-center gap-2.5 rounded transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <AuthorAvatar author={author} />
          <span>
            <span className="text-foreground">{author.name}</span>, {author.role}
          </span>
        </Link>
        <span>
          Published <time dateTime={meta.publishedAt}>{formatPostDate(meta.publishedAt)}</time>
        </span>
        {isUpdated && meta.updatedAt && (
          <span>
            Updated <time dateTime={meta.updatedAt}>{formatPostDate(meta.updatedAt)}</time>
          </span>
        )}
        <span>{formatReadingTime(post.readingMinutes)}</span>
      </div>
    </header>
  );
}
