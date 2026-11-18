import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/blog";
import { ROUTES } from "@/config/routes";
import type { RelatedPostsProps } from "./types";

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="related-posts-heading" className="text-display-md font-medium">
          Keep reading
        </h2>
        <Link
          href={ROUTES.blog}
          className="inline-flex items-center gap-1.5 rounded text-base font-medium text-primary-text underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          All guides
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} headingLevel={3} />
        ))}
      </div>
    </section>
  );
}
