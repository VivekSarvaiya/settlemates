import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HowToSplit } from "@/app/(marketing)/split-bill-calculator/_components/HowToSplit/HowToSplit";

describe("HowToSplit", () => {
  it("answers the question and works the example through the real engine", () => {
    render(<HowToSplit />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "How to split a bill when people paid different amounts",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Example: dinner for 3, ₹3,000" }),
    ).toBeInTheDocument();
    expect(screen.getByText("₹3,000 ÷ 3 people = ₹1,000 each.")).toBeInTheDocument();

    const balances = within(screen.getByRole("list", { name: "Example balances" }));
    expect(balances.getByText("gets back ₹1,400")).toBeInTheDocument();
    expect(balances.getByText("owes ₹400")).toBeInTheDocument();
    expect(balances.getByText("owes ₹1,000")).toBeInTheDocument();

    const payments = within(screen.getByRole("list", { name: "Example payments" }));
    expect(
      payments.getAllByRole("listitem").map((row) => row.textContent),
    ).toEqual(["Priya pays you₹1,000", "Amit pays you₹400"]);
  });
});
