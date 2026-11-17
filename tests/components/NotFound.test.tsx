import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotFound } from "@/app/_components";

describe("NotFound", () => {
  it("explains the missing page and points back to the calculator and home", () => {
    render(<NotFound />);

    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "This page skipped out on the bill.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Split a bill" })).toHaveAttribute(
      "href",
      "/split-bill-calculator",
    );
    expect(screen.getByRole("button", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );

    const receipt = within(
      screen.getByRole("region", { name: "Receipt for this page" }),
    );
    expect(receipt.getByText("0 people")).toBeInTheDocument();
    expect(receipt.getByText("₹404 ÷ 0")).toBeInTheDocument();
    expect(receipt.getByText("one apology")).toBeInTheDocument();
  });
});
