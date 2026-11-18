import { describe, expect, it } from "vitest";
import { buildRssFeed } from "@/lib/blog/feed";
import { buildPost } from "@/tests/fixtures/blog";

describe("RSS feed", () => {
  it("lists published posts with escaped text and leaves drafts out", () => {
    const feed = buildRssFeed([
      buildPost({
        slug: "rent-and-bills",
        meta: { title: "Rent & bills <for flatmates>", updatedAt: "2026-11-09" },
      }),
      buildPost({ slug: "secret-draft", meta: { draft: true } }),
    ]);

    expect(feed).toContain("<title>Rent &amp; bills &lt;for flatmates&gt;</title>");
    expect(feed).toContain("<link>https://settlemates.test/blog/rent-and-bills</link>");
    expect(feed).toContain("<pubDate>Sun, 01 Nov 2026 00:00:00 GMT</pubDate>");
    expect(feed).toContain("<lastBuildDate>Mon, 09 Nov 2026 00:00:00 GMT</lastBuildDate>");
    expect(feed).toContain('href="https://settlemates.test/blog/feed.xml" rel="self"');
    expect(feed).not.toContain("secret-draft");
  });

  it("is still a valid empty channel before the first post", () => {
    const feed = buildRssFeed([]);
    expect(feed).toContain("<channel>");
    expect(feed).not.toContain("<item>");
    expect(feed).not.toContain("lastBuildDate");
  });
});
