import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SplitCalculator } from "@/components/shared/SplitCalculator/SplitCalculator";

function getSharesList() {
  return within(screen.getByRole("list", { name: "Shares" }));
}

function getPaymentsList() {
  return within(screen.getByRole("list", { name: "Payments" }));
}

function getSummary() {
  return within(screen.getByRole("group", { name: "Split summary" }));
}

describe("SplitCalculator", () => {
  it("starts with contributions only and waits for payments", () => {
    render(<SplitCalculator />);

    expect(
      screen.queryByRole("group", { name: "Split method" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Paid" }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Name for person 1")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Amount paid by person 1"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter what each person paid to get started."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Split it" })).toBeDisabled();
  });

  it("derives the bill total from contributions and splits it equally", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Amount paid by person 1"), "40");
    await user.type(screen.getByLabelText("Amount paid by person 2"), "30");
    await user.type(screen.getByLabelText("Amount paid by person 3"), "30");

    const summary = getSummary();
    expect(summary.getByText("₹100")).toBeInTheDocument();
    expect(summary.getByText("₹25")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Split it" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Split it" }));

    expect(screen.getByText("Each of 4 pays")).toBeInTheDocument();
    expect(screen.getByText("from a ₹100 bill")).toBeInTheDocument();

    const shares = getSharesList();
    expect(shares.getAllByText("₹25")).toHaveLength(4);
    expect(shares.getByText("paid ₹40")).toBeInTheDocument();
    expect(shares.getAllByText("paid ₹0")).toHaveLength(1);

    const payments = getPaymentsList();
    expect(payments.getAllByRole("listitem")).toHaveLength(3);
    expect(payments.getByText("Kabir pays You")).toBeInTheDocument();
    expect(payments.getByText("Kabir pays Amit")).toBeInTheDocument();
    expect(payments.getByText("Kabir pays Priya")).toBeInTheDocument();
  });

  it("rounds leftover paisa to the first person and explains it", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.click(screen.getByRole("button", { name: "Remove one person" }));
    await user.type(screen.getByLabelText("Amount paid by person 1"), "60");
    await user.type(screen.getByLabelText("Amount paid by person 2"), "40");

    await user.click(screen.getByRole("button", { name: "Split it" }));

    expect(screen.getByText("Each of 3 pays")).toBeInTheDocument();
    expect(
      screen.getByText("The extra ₹0.01 goes to You."),
    ).toBeInTheDocument();

    const shares = getSharesList();
    expect(shares.getByText("₹33.34")).toBeInTheDocument();
    expect(shares.getAllByText("₹33.33")).toHaveLength(2);
  });

  it("settles contributions so every person ends up square", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    for (let person = 0; person < 8; person += 1) {
      await user.click(screen.getByRole("button", { name: "Add one person" }));
    }

    await user.type(screen.getByLabelText("Amount paid by person 2"), "900");
    await user.type(screen.getByLabelText("Amount paid by person 3"), "775");
    await user.type(screen.getByLabelText("Amount paid by person 4"), "140");
    await user.type(screen.getByLabelText("Amount paid by person 5"), "248");
    await user.type(screen.getByLabelText("Amount paid by person 6"), "60");
    await user.type(screen.getByLabelText("Amount paid by person 7"), "80");

    expect(getSummary().getByText("₹2,203")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Split it" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Split it" }));

    expect(screen.getByText("Each of 12 pays")).toBeInTheDocument();
    expect(
      screen.getByText("The extra ₹0.04 goes to You, Amit, Priya, Kabir."),
    ).toBeInTheDocument();

    const shares = getSharesList();
    expect(shares.getAllByText("₹183.59")).toHaveLength(4);
    expect(shares.getAllByText("₹183.58")).toHaveLength(8);

    const payments = getPaymentsList();
    expect(payments.getAllByRole("listitem")).toHaveLength(11);
    expect(payments.getByText("You pays Amit")).toBeInTheDocument();
    expect(payments.getByText("Arjun pays Priya")).toBeInTheDocument();
    expect(payments.getByText("Friend 11 pays Amit")).toBeInTheDocument();
    expect(payments.getByText("Kabir pays Priya")).toBeInTheDocument();
    expect(screen.getByText("11 payments")).toBeInTheDocument();
  });

  it("flags invalid payments and blocks the split", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    const firstPayment = screen.getByLabelText("Amount paid by person 1");
    await user.type(firstPayment, "abc");

    expect(
      screen.getByText("Fix the highlighted payments to continue."),
    ).toBeInTheDocument();
    expect(firstPayment).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("button", { name: "Split it" })).toBeDisabled();

    await user.clear(firstPayment);
    await user.type(firstPayment, "100");

    expect(
      screen.queryByText("Fix the highlighted payments to continue."),
    ).not.toBeInTheDocument();
    expect(firstPayment).not.toHaveAttribute("aria-invalid");
    expect(screen.getByRole("button", { name: "Split it" })).toBeEnabled();
  });

  it("says so when everyone is already square", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    for (let person = 1; person <= 4; person += 1) {
      await user.type(
        screen.getByLabelText(`Amount paid by person ${person}`),
        "25",
      );
    }

    await user.click(screen.getByRole("button", { name: "Split it" }));

    expect(
      screen.getByText("Everyone's square. No one needs to pay anyone."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: "Payments" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Who pays whom")).not.toBeInTheDocument();
  });

  it("returns to the same contributions when editing a result", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Amount paid by person 1"), "40");
    await user.type(screen.getByLabelText("Amount paid by person 2"), "60");
    await user.click(screen.getByRole("button", { name: "Split it" }));

    await user.click(screen.getByRole("button", { name: "Edit payments" }));

    expect(
      screen.queryByRole("group", { name: "Split method" }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Amount paid by person 1")).toHaveValue("40");
    expect(screen.getByLabelText("Amount paid by person 2")).toHaveValue("60");
    expect(screen.getByLabelText("Amount paid by person 1")).toHaveFocus();
    expect(screen.getByRole("button", { name: "Split it" })).toBeEnabled();
  });

  it("starts over with a blank slate", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Amount paid by person 1"), "100");
    await user.click(screen.getByRole("button", { name: "Split it" }));
    await user.click(screen.getByRole("button", { name: "Start over" }));

    const payments = screen.getAllByLabelText(/Amount paid by person \d+/);
    expect(payments).toHaveLength(4);
    for (const payment of payments) {
      expect(payment).toHaveValue("");
    }
    expect(
      screen.getByText("Enter what each person paid to get started."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Split it" })).toBeDisabled();
  });
});
