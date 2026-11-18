import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { blogPostPath } from "@/config/routes";
import { formatPostDate, formatReadingTime } from "@/lib/blog/format";
import type { PostCardProps } from "./types";

export function PostCard({ post, isFeatured = false, headingLevel = 2 }: PostCardProps) {
  const { meta } = post;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded border border-border bg-background transition-colors hover:border-foreground/25",
        isFeatured && "lg:flex-row",
      )}
    >
      {meta.image && (
        <Image
          src={meta.image.src}
          alt={meta.image.alt}
          loading={isFeatured ? "eager" : "lazy"}
          sizes={isFeatured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className={cn(
            "aspect-video w-full border-b border-border object-cover",
            isFeatured && "lg:w-1/2 lg:border-r lg:border-b-0",
          )}
        />
      )}

      <div
        className={cn(
          "flex flex-1 flex-col gap-3 p-6",
          isFeatured && "md:p-10",
          isFeatured && meta.image && "lg:justify-center",
        )}
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline">{meta.category}</Badge>
          {meta.draft && <Badge variant="destructive">Draft</Badge>}
        </div>
        <Heading
          className={cn(
            "font-medium text-balance",
            isFeatured ? "text-display-md" : "text-lg",
          )}
        >
          <Link
            href={blogPostPath(post.slug)}
            className="outline-none after:absolute after:inset-0 after:rounded focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
          >
            {meta.title}
          </Link>
        </Heading>
        <p
          className={cn(
            "line-clamp-3 text-base text-muted-foreground",
            isFeatured && "max-w-2xl md:text-lead",
          )}
        >
          {meta.description}
        </p>
        <p className="mt-auto pt-2 text-sm text-muted-foreground">
          <time dateTime={meta.publishedAt}>{formatPostDate(meta.publishedAt)}</time>
          {" · "}
          {formatReadingTime(post.readingMinutes)}
        </p>
      </div>
    </article>
  );
}
