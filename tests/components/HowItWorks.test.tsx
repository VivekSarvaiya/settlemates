import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HowItWorks } from "@/app/(marketing)/_components/HowItWorks/HowItWorks";

describe("HowItWorks", () => {
  it("shows the Goa example settled by the real engine", () => {
    render(<HowItWorks />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Six friends. One Goa weekend. Four payments to settle it.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("₹30,000 in total, ₹5,000 each."),
    ).toBeInTheDocument();

    const payments = within(screen.getByRole("list", { name: "Who pays whom" }));
    const rows = payments.getAllByRole("listitem").map((row) => row.textContent);
    expect(rows).toEqual([
      "Priya pays you₹3,200",
      "Kabir pays Amit₹2,400",
      "Neha pays you₹1,600",
      "Neha pays Amit₹800",
    ]);
    expect(
      screen.getByText("Rohan already paid their share and has nothing more to pay."),
    ).toBeInTheDocument();
  });
});
