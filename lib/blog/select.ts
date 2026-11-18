import type { PostMeta, PostSummary } from "./types";

export const getLastModified = (meta: Pick<PostMeta, "publishedAt" | "updatedAt">) =>
  meta.updatedAt ?? meta.publishedAt;

export const isPostVisible = (post: PostSummary, canShowDrafts: boolean) =>
  canShowDrafts || !post.meta.draft;

export const getPublishedPosts = (posts: PostSummary[]) =>
  posts.filter((post) => !post.meta.draft);

export const sortPostsByNewest = (posts: PostSummary[]) =>
  [...posts].sort(
    (a, b) =>
      b.meta.publishedAt.localeCompare(a.meta.publishedAt) ||
      a.slug.localeCompare(b.slug),
  );

export const getRelatedPosts = (
  post: PostSummary,
  posts: PostSummary[],
  limit: number,
) => {
  const others = sortPostsByNewest(posts.filter((other) => other.slug !== post.slug));
  const sameCategory = others.filter(
    (other) => other.meta.category === post.meta.category,
  );
  const otherCategories = others.filter(
    (other) => other.meta.category !== post.meta.category,
  );
  return [...sameCategory, ...otherCategories].slice(0, limit);
};
