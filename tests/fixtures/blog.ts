import type { PostMeta, PostSummary } from "@/lib/blog/types";

type PostOverrides = Partial<Omit<PostSummary, "meta">> & { meta?: Partial<PostMeta> };

export const buildPost = ({ meta, ...overrides }: PostOverrides = {}): PostSummary => ({
  slug: "split-a-dinner-bill",
  headings: [],
  wordCount: 600,
  readingMinutes: 3,
  ...overrides,
  meta: {
    title: "How to split a dinner bill fairly",
    description:
      "A step-by-step way to split a restaurant bill when everyone ordered something different.",
    publishedAt: "2026-11-01",
    category: "Guides",
    authorId: "founder",
    draft: false,
    ...meta,
  },
});
