import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/app/(marketing)/_components/Footer/Footer";

describe("Footer", () => {
  it("links to the calculator, and to the blog only once there are posts", () => {
    const { rerender } = render(<Footer isBlogVisible={false} />);
    const footerNav = () => within(screen.getByRole("navigation", { name: "Footer" }));

    expect(screen.getByRole("button", { name: "Split a bill" })).toHaveAttribute(
      "href",
      "/split-bill-calculator",
    );
    expect(footerNav().queryByRole("link", { name: "Blog" })).not.toBeInTheDocument();

    rerender(<Footer isBlogVisible />);
    expect(footerNav().getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });

  it("keeps the giant wordmark away from screen readers", () => {
    render(<Footer isBlogVisible />);

    const letters = screen.getAllByText("M");
    expect(letters.length).toBeGreaterThan(0);
    letters.forEach((letter) => {
      expect(letter.closest('[aria-hidden="true"]')).not.toBeNull();
    });
  });
});
