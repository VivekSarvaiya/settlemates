import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableOfContents } from "@/app/(marketing)/blog/[slug]/_components";
import type { PostHeading } from "@/lib/blog/types";

const HEADINGS: PostHeading[] = [
  { depth: 2, text: "Add it up", id: "add-it-up" },
  { depth: 3, text: "Who paid what", id: "who-paid-what" },
  { depth: 2, text: "Settle up", id: "settle-up" },
];

describe("TableOfContents", () => {
  it("links to every section, in order", () => {
    render(<TableOfContents headings={HEADINGS} variant="sidebar" />);

    const nav = within(screen.getByRole("navigation", { name: "On this page" }));
    expect(
      nav.getAllByRole("link").map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["Add it up", "#add-it-up"],
      ["Who paid what", "#who-paid-what"],
      ["Settle up", "#settle-up"],
    ]);
  });

  it("collapses into a disclosure on small screens", () => {
    render(<TableOfContents headings={HEADINGS} variant="collapsible" />);

    expect(screen.getByText("On this page").closest("summary")).toBeInTheDocument();
    expect(screen.getByRole("group")).not.toHaveAttribute("open");
  });

  it("stays out of the way on short posts", () => {
    const { container } = render(
      <TableOfContents headings={HEADINGS.slice(0, 1)} variant="sidebar" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
