import { describe, expect, it } from "vitest";
import { buildSitemap } from "@/lib/seo";
import { buildPost } from "@/tests/fixtures/blog";

describe("sitemap", () => {
  it("leaves the blog out until a post is published", () => {
    const urls = buildSitemap([buildPost({ meta: { draft: true } })]).map((entry) => entry.url);
    expect(urls).toEqual([
      "https://settlemates.test/",
      "https://settlemates.test/split-bill-calculator",
      "https://settlemates.test/about",
      "https://settlemates.test/privacy",
      "https://settlemates.test/terms",
    ]);
  });

  it("adds the blog and each published post with its last-modified date", () => {
    const entries = buildSitemap([
      buildPost({ slug: "newest", meta: { publishedAt: "2026-11-10" } }),
      buildPost({ slug: "edited", meta: { publishedAt: "2026-11-01", updatedAt: "2026-11-12" } }),
      buildPost({ slug: "hidden", meta: { draft: true } }),
    ]);

    expect(entries).toContainEqual({
      url: "https://settlemates.test/blog",
      lastModified: "2026-11-10",
    });
    expect(entries).toContainEqual({
      url: "https://settlemates.test/blog/edited",
      lastModified: "2026-11-12",
    });
    expect(entries.map((entry) => entry.url)).not.toContain(
      "https://settlemates.test/blog/hidden",
    );
  });
});
