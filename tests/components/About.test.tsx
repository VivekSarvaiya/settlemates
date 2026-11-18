import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutHero, Team } from "@/app/(marketing)/about/_components";

describe("About page", () => {
  it("points to the calculator, and to the guides only once there are some", () => {
    const { rerender } = render(<AboutHero hasGuides={false} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Built for the moment the bill arrives." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try the calculator" })).toHaveAttribute(
      "href",
      "/split-bill-calculator",
    );
    expect(screen.queryByRole("button", { name: "Read the guides" })).not.toBeInTheDocument();

    rerender(<AboutHero hasGuides />);
    expect(screen.getByRole("button", { name: "Read the guides" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  it("gives each author an anchor that bylines can link to", () => {
    render(<Team />);
    expect(screen.getByRole("article", { name: "Name" })).toHaveAttribute("id", "founder");
  });
});
