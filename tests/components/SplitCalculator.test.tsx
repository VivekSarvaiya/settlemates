import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SplitCalculator } from "@/components/shared/SplitCalculator/SplitCalculator";

describe("SplitCalculator", () => {
  it("splits ₹100 three ways and gives the extra paisa to the payer", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Bill total"), "100");
    await user.click(screen.getByRole("button", { name: "Remove one person" }));
    await user.click(screen.getByRole("button", { name: "Split it" }));

    expect(screen.getByText("₹33.34")).toBeInTheDocument();
    expect(screen.getAllByText("₹33.33")).toHaveLength(2);
    expect(
      screen.getByText(/The extra ₹0\.01 goes to You\./),
    ).toBeInTheDocument();
    expect(screen.getByText("Adds up to ₹100 exactly")).toBeInTheDocument();
  });

  it("keeps exact splits blocked until every row is assigned", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Bill total"), "100");
    await user.click(screen.getByRole("button", { name: "Remove one person" }));
    await user.click(screen.getByRole("button", { name: "Split it" }));
    await user.click(screen.getByRole("button", { name: "Customise split" }));
    await user.click(screen.getByRole("button", { name: "Amount" }));

    expect(screen.getByText("₹100 still to assign")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Exact amount for person 1"), "40");
    await user.type(screen.getByLabelText("Exact amount for person 2"), "60");

    expect(screen.getByText("Enter a share for everyone")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply split" })).toBeDisabled();

    await user.type(screen.getByLabelText("Exact amount for person 3"), "0");

    expect(screen.getByText("Adds up to ₹100 exactly")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply split" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Apply split" }));

    expect(screen.getByText("₹40")).toBeInTheDocument();
    expect(screen.getByText("₹60")).toBeInTheDocument();
    expect(screen.getByText("Bill total")).toBeInTheDocument();
  });

  it("shows how much of the total percentages still leave unassigned", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Bill total"), "100");
    await user.click(screen.getByRole("button", { name: "Remove one person" }));
    await user.click(screen.getByRole("button", { name: "Split it" }));
    await user.click(screen.getByRole("button", { name: "Customise split" }));
    await user.click(screen.getByRole("button", { name: "Percentage" }));

    expect(screen.getByText("₹100 still to assign")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Percentage for person 1"), "50");
    await user.type(screen.getByLabelText("Percentage for person 2"), "30");

    expect(screen.getByText("₹20 still to assign")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Percentage for person 3"), "20");

    expect(screen.getByText("Adds up to ₹100 exactly")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Apply split" }));

    expect(screen.getByText("₹50")).toBeInTheDocument();
    expect(screen.getByText("₹30")).toBeInTheDocument();
    expect(screen.getByText("₹20")).toBeInTheDocument();
  });

  it("rejects an amount that cannot be parsed before showing a result", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Bill total"), "0");
    await user.click(screen.getByRole("button", { name: "Split it" }));

    expect(screen.getByText("Enter an amount greater than 0.")).toBeInTheDocument();
    expect(screen.queryByText("Everyone's share, worked out.")).not.toBeInTheDocument();
  });
});
