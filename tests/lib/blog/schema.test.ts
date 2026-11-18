import { describe, expect, it } from "vitest";
import { isValidPostSlug, parsePostMeta } from "@/lib/blog/schema";

const VALID_META = {
  title: "How to split a dinner bill fairly",
  description:
    "A step-by-step way to split a restaurant bill when everyone ordered something different.",
  publishedAt: "2026-11-01",
  category: "Guides",
  authorId: "founder",
};

describe("post meta schema", () => {
  it("accepts valid meta and defaults draft to false", () => {
    expect(parsePostMeta("dinner", VALID_META)).toEqual({ ...VALID_META, draft: false });
  });

  it("names the post and the broken field when meta is invalid", () => {
    expect(() => parsePostMeta("dinner", { ...VALID_META, category: "Crypto" })).toThrow(
      /content\/blog\/dinner[\s\S]*category/,
    );
    expect(() => parsePostMeta("dinner", { ...VALID_META, authorId: "someone" })).toThrow(
      /authorId/,
    );
    expect(() => parsePostMeta("dinner", { ...VALID_META, title: "x".repeat(71) })).toThrow(
      /title/,
    );
    expect(() => parsePostMeta("dinner", { ...VALID_META, publishedAt: "1 Nov 2026" })).toThrow(
      /publishedAt/,
    );
    expect(() => parsePostMeta("dinner", undefined)).toThrow(/content\/blog\/dinner/);
  });

  it("rejects an update date before the publish date", () => {
    expect(() =>
      parsePostMeta("dinner", { ...VALID_META, updatedAt: "2026-10-01" }),
    ).toThrow(/updatedAt/);
  });

  it("requires imported images with alt text", () => {
    const image = { src: "/hero.png", width: 1200, height: 630 };
    expect(
      parsePostMeta("dinner", { ...VALID_META, image: { src: image, alt: "Receipt" } }).image,
    ).toEqual({ src: image, alt: "Receipt" });
    expect(() =>
      parsePostMeta("dinner", { ...VALID_META, image: { src: "/hero.png", alt: "Receipt" } }),
    ).toThrow(/Import the image file/);
  });

  it("allows only lowercase hyphenated slugs", () => {
    expect(isValidPostSlug("split-a-bill-2026")).toBe(true);
    expect(isValidPostSlug("Split-A-Bill")).toBe(false);
    expect(isValidPostSlug("split_a_bill")).toBe(false);
    expect(isValidPostSlug("-split")).toBe(false);
  });
});
