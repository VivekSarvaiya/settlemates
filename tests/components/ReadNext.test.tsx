import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickLinks, RelatedPosts } from "@/app/(marketing)/blog/[slug]/_components";
import { buildPost } from "@/tests/fixtures/blog";

describe("Read next", () => {
  it("recommends other posts with a way to see every guide", () => {
    render(
      <RelatedPosts
        posts={[
          buildPost({ slug: "split-rent", meta: { title: "How to split rent fairly" } }),
          buildPost({ slug: "trip-costs", meta: { title: "Splitting trip costs" } }),
        ]}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Keep reading" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "How to split rent fairly" })).toHaveAttribute(
      "href",
      "/blog/split-rent",
    );
    expect(screen.getByRole("link", { name: "All guides" })).toHaveAttribute("href", "/blog");
  });

  it("disappears when there's nothing else to read", () => {
    const { container } = render(<RelatedPosts posts={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("offers quick links to the calculator, the blog and the home page answers", () => {
    render(<QuickLinks />);

    const nav = within(screen.getByRole("navigation", { name: "Quick links" }));
    expect(
      nav.getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual(["/split-bill-calculator", "/blog", "/#how-it-works", "/#faq"]);
  });
});
