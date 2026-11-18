import { describe, expect, it } from "vitest";
import {
  countWords,
  extractHeadings,
  findDuplicateHeadingIds,
  getReadingMinutes,
  slugifyHeading,
} from "@/lib/blog/headings";

const SOURCE = `import figure from "./figure.png";

Intro paragraph with five words.

## Split **bills** with [UPI](https://example.com)

\`\`\`md
## Not a heading inside code
\`\`\`

### ₹500 vs ₹1,000?

<Callout variant="tip">
  Callout text counts too.
</Callout>

#### Too deep for the TOC
`;

describe("blog headings", () => {
  it("lists h2 and h3 headings outside code, with plain text and slugs", () => {
    expect(extractHeadings(SOURCE)).toEqual([
      { depth: 2, text: "Split bills with UPI", id: "split-bills-with-upi" },
      { depth: 3, text: "₹500 vs ₹1,000?", id: "500-vs-1000" },
    ]);
  });

  it("keeps letters from any script in slugs", () => {
    expect(slugifyHeading("किराया कैसे बाँटें")).toBe("किराया-कैसे-बाँटें");
    expect(slugifyHeading("  Who pays — whom?  ")).toBe("who-pays-whom");
  });

  it("reports headings that would share an anchor", () => {
    const headings = extractHeadings("## Rent\n\n## Rent!\n\n## Bills");
    expect(findDuplicateHeadingIds(headings)).toEqual(["rent"]);
  });

  it("counts only reader-visible words and rounds reading time up", () => {
    expect(countWords(SOURCE)).toBe(26);
    expect(getReadingMinutes(0)).toBe(1);
    expect(getReadingMinutes(200)).toBe(1);
    expect(getReadingMinutes(201)).toBe(2);
  });
});
