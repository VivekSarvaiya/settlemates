import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MdxH2 } from "@/components/mdx/Heading/Heading";
import { extractHeadings } from "@/lib/blog/headings";

describe("MDX heading", () => {
  it("gets the same id the table of contents links to", () => {
    const [tocEntry] = extractHeadings("## Split **bills** with [UPI](https://example.com)");
    render(
      <MdxH2>
        Split <strong>bills</strong> with <a href="https://example.com">UPI</a>
      </MdxH2>,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", tocEntry.id);
    expect(
      screen.getByRole("link", { name: "Link to section: Split bills with UPI" }),
    ).toHaveAttribute("href", `#${tocEntry.id}`);
  });
});
