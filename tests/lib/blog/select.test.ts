import { describe, expect, it } from "vitest";
import {
  getLastModified,
  getPublishedPosts,
  getRelatedPosts,
  isPostVisible,
  sortPostsByNewest,
} from "@/lib/blog/select";
import { buildPost } from "@/tests/fixtures/blog";

describe("blog post selection", () => {
  it("hides drafts unless the environment allows them", () => {
    const draft = buildPost({ meta: { draft: true } });
    expect(isPostVisible(draft, false)).toBe(false);
    expect(isPostVisible(draft, true)).toBe(true);
    expect(getPublishedPosts([draft, buildPost()])).toHaveLength(1);
  });

  it("sorts newest first, then by slug for posts on the same day", () => {
    const posts = [
      buildPost({ slug: "b-post", meta: { publishedAt: "2026-11-02" } }),
      buildPost({ slug: "old-post", meta: { publishedAt: "2026-10-01" } }),
      buildPost({ slug: "a-post", meta: { publishedAt: "2026-11-02" } }),
    ];
    expect(sortPostsByNewest(posts).map((post) => post.slug)).toEqual([
      "a-post",
      "b-post",
      "old-post",
    ]);
  });

  it("uses the updated date as last modified when there is one", () => {
    expect(getLastModified({ publishedAt: "2026-11-01" })).toBe("2026-11-01");
    expect(
      getLastModified({ publishedAt: "2026-11-01", updatedAt: "2026-11-09" }),
    ).toBe("2026-11-09");
  });

  it("picks related posts from the same category first, never the post itself", () => {
    const current = buildPost({ slug: "current", meta: { category: "Trips" } });
    const posts = [
      current,
      buildPost({ slug: "guide-new", meta: { category: "Guides", publishedAt: "2026-11-10" } }),
      buildPost({ slug: "trip-old", meta: { category: "Trips", publishedAt: "2026-10-01" } }),
      buildPost({ slug: "trip-new", meta: { category: "Trips", publishedAt: "2026-11-05" } }),
      buildPost({ slug: "guide-old", meta: { category: "Guides", publishedAt: "2026-09-01" } }),
    ];
    expect(getRelatedPosts(current, posts, 3).map((post) => post.slug)).toEqual([
      "trip-new",
      "trip-old",
      "guide-new",
    ]);
  });
});
