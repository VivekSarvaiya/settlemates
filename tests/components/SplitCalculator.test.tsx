import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SplitCalculator } from "@/components/shared/SplitCalculator/SplitCalculator";
import {
  decodeSplitHash,
  encodeSplit,
} from "@/components/shared/SplitCalculator/splitLink";

const SUBMIT = "See who pays whom";

function getSharesList() {
  return within(screen.getByRole("list", { name: "Shares" }));
}

function getPaymentsList() {
  return within(screen.getByRole("list", { name: "Payments" }));
}

function getSummary() {
  return within(screen.getByRole("group", { name: "Split summary" }));
}

function stubClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return writeText;
}

afterEach(() => {
  window.history.replaceState(null, "", "/");
  Reflect.deleteProperty(navigator, "share");
});

describe("SplitCalculator", () => {
  it("starts with contributions only and waits for payments", () => {
    render(<SplitCalculator />);

    expect(screen.getByLabelText("Name for person 1")).toHaveValue("You");
    expect(
      screen.getByLabelText("Amount paid by person 1"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tap a name to rename it, then add what each person paid."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter what each person paid to get started."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: SUBMIT })).toBeDisabled();
  });

  it("shows each person's balance live and splits the total equally", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Amount paid by person 1"), "40");
    await user.type(screen.getByLabelText("Amount paid by person 2"), "30");
    await user.type(screen.getByLabelText("Amount paid by person 3"), "30");

    const summary = getSummary();
    expect(summary.getByText("Each person's share")).toBeInTheDocument();
    expect(summary.getByText("₹100")).toBeInTheDocument();
    expect(summary.getByText("₹25")).toBeInTheDocument();
    expect(screen.getByText("gets back ₹15")).toBeInTheDocument();
    expect(screen.getAllByText("gets back ₹5")).toHaveLength(2);
    expect(screen.getByText("owes ₹25")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: SUBMIT })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: SUBMIT }));

    expect(screen.getByText("4 people · ₹100 bill")).toBeInTheDocument();

    const shares = getSharesList();
    expect(shares.getByText("paid ₹40")).toBeInTheDocument();
    expect(shares.getByText("paid ₹0")).toBeInTheDocument();
    expect(shares.getByText("owes ₹25")).toBeInTheDocument();

    const payments = getPaymentsList();
    expect(payments.getAllByRole("listitem")).toHaveLength(3);
    expect(payments.getByText("Kabir pays you")).toBeInTheDocument();
    expect(payments.getByText("Kabir pays Amit")).toBeInTheDocument();
    expect(payments.getByText("Kabir pays Priya")).toBeInTheDocument();
  });

  it("rounds leftover paisa to the first person and explains it", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.click(screen.getByRole("button", { name: "Remove one person" }));
    await user.type(screen.getByLabelText("Amount paid by person 1"), "60");
    await user.type(screen.getByLabelText("Amount paid by person 2"), "40");

    await user.click(screen.getByRole("button", { name: SUBMIT }));

    expect(screen.getByText("3 people · ₹100 bill")).toBeInTheDocument();
    expect(
      screen.getByText("The extra ₹0.01 goes to You."),
    ).toBeInTheDocument();

    const shares = getSharesList();
    expect(shares.getByText("gets back ₹26.66")).toBeInTheDocument();
    expect(shares.getByText("gets back ₹6.67")).toBeInTheDocument();
    expect(shares.getByText("owes ₹33.33")).toBeInTheDocument();
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

    await user.click(screen.getByRole("button", { name: SUBMIT }));

    expect(screen.getByText("12 people · ₹2,203 bill")).toBeInTheDocument();
    expect(
      screen.getByText("The extra ₹0.04 goes to You, Amit, Priya, Kabir."),
    ).toBeInTheDocument();

    const payments = getPaymentsList();
    expect(payments.getAllByRole("listitem")).toHaveLength(11);
    expect(payments.getByText("You pay Amit")).toBeInTheDocument();
    expect(payments.getByText("Arjun pays Priya")).toBeInTheDocument();
    expect(payments.getByText("Friend 11 pays Amit")).toBeInTheDocument();
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
    expect(screen.getByRole("button", { name: SUBMIT })).toBeDisabled();

    await user.tab();
    expect(firstPayment).toHaveValue("abc");

    await user.clear(firstPayment);
    await user.type(firstPayment, "100");

    expect(
      screen.queryByText("Fix the highlighted payments to continue."),
    ).not.toBeInTheDocument();
    expect(firstPayment).not.toHaveAttribute("aria-invalid");
    expect(screen.getByRole("button", { name: SUBMIT })).toBeEnabled();
  });

  it("groups digits the Indian way once an amount is entered", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    const firstPayment = screen.getByLabelText("Amount paid by person 1");
    await user.type(firstPayment, "1234567.5");
    await user.tab();

    expect(firstPayment).toHaveValue("12,34,567.50");
    expect(getSummary().getByText("₹12,34,567.50")).toBeInTheDocument();
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

    expect(screen.getAllByText("all square")).toHaveLength(4);

    await user.click(screen.getByRole("button", { name: SUBMIT }));

    expect(
      screen.getByText("Everyone's square. No one needs to pay anyone."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: "Payments" }),
    ).not.toBeInTheDocument();
  });

  it("returns to the same contributions when editing a result", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Amount paid by person 1"), "40");
    await user.type(screen.getByLabelText("Amount paid by person 2"), "60");
    await user.click(screen.getByRole("button", { name: SUBMIT }));

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByLabelText("Amount paid by person 1")).toHaveValue("40");
    expect(screen.getByLabelText("Amount paid by person 2")).toHaveValue("60");
    expect(screen.getByLabelText("Amount paid by person 1")).toHaveFocus();
    expect(screen.getByRole("button", { name: SUBMIT })).toBeEnabled();
  });

  it("starts over with a blank slate", async () => {
    const user = userEvent.setup();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Amount paid by person 1"), "100");
    await user.click(screen.getByRole("button", { name: SUBMIT }));
    await user.click(screen.getByRole("button", { name: "Start over" }));

    const payments = screen.getAllByLabelText(/Amount paid by person \d+/);
    expect(payments).toHaveLength(4);
    for (const payment of payments) {
      expect(payment).toHaveValue("");
    }
    expect(screen.getByRole("button", { name: SUBMIT })).toBeDisabled();
  });

  it("copies a summary with a link that reopens the same split", async () => {
    const user = userEvent.setup();
    const writeText = stubClipboard();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Amount paid by person 1"), "2400");
    await user.click(screen.getByRole("button", { name: SUBMIT }));
    await user.click(
      screen.getByRole("button", { name: "Copy for the group chat" }),
    );

    expect(
      await screen.findByText(
        "Copied, with a link that reopens this split. Paste it in the group chat.",
      ),
    ).toBeInTheDocument();

    const text = writeText.mock.calls[0]?.[0] as string;
    expect(text).toContain("₹2,400 split between 4 people");
    expect(text).toContain("Each person's share: ₹600");
    expect(text).toContain("You paid ₹2,400 · gets back ₹1,800");
    expect(text).toContain("Amit pays you ₹600");

    const link = text.split("Open this split on SettleMates: ")[1] ?? "";
    expect(link).toMatch(/^http:\/\/localhost:3000\/split-bill-calculator#split=/);
    expect(decodeSplitHash(new URL(link).hash)).toEqual([
      { name: "You", paidCents: 240_000 },
      { name: "Amit", paidCents: 0 },
      { name: "Priya", paidCents: 0 },
      { name: "Kabir", paidCents: 0 },
    ]);
  });

  it("opens a shared link straight to its result and clears it from the address bar", async () => {
    window.history.replaceState(
      null,
      "",
      `/split-bill-calculator#split=${encodeSplit([
        { name: "Riya", paidCents: 90_000 },
        { name: "सोनू", paidCents: 30_000 },
      ])}`,
    );
    render(<SplitCalculator />);

    expect(
      await screen.findByText("2 people · ₹1,200 bill"),
    ).toBeInTheDocument();
    expect(getPaymentsList().getByText("सोनू pays Riya")).toBeInTheDocument();
    expect(window.location.hash).toBe("");
  });

  it("ignores a broken link and starts empty", () => {
    window.history.replaceState(null, "", "/split-bill-calculator#split=not-a-split");
    render(<SplitCalculator />);

    expect(screen.getByRole("button", { name: SUBMIT })).toBeDisabled();
    expect(window.location.hash).toBe("#split=not-a-split");
  });

  it("rejects shared links that break the split rules", () => {
    const toHash = (people: { name: string; paidCents: number }[]) =>
      `#split=${encodeSplit(people)}`;
    const person = (paidCents: number, name = "Riya") => ({ name, paidCents });

    expect(decodeSplitHash(toHash([person(100)]))).toEqual([person(100)]);
    expect(decodeSplitHash(toHash([person(100, "R".repeat(40))]))).not.toBeNull();
    expect(decodeSplitHash(toHash([person(100, "R".repeat(41))]))).toBeNull();
    expect(decodeSplitHash(toHash([person(-100), person(300)]))).toBeNull();
    expect(decodeSplitHash(toHash([person(10.5)]))).toBeNull();
    expect(decodeSplitHash(toHash([person(0), person(0)]))).toBeNull();
    expect(decodeSplitHash(toHash([]))).toBeNull();
    expect(decodeSplitHash(toHash(Array.from({ length: 50 }, () => person(1))))).not.toBeNull();
    expect(decodeSplitHash(toHash(Array.from({ length: 51 }, () => person(1))))).toBeNull();
    expect(
      decodeSplitHash(toHash([person(Number.MAX_SAFE_INTEGER), person(1)])),
    ).toBeNull();
    expect(
      decodeSplitHash(`#split=${btoa(JSON.stringify([["Riya", "100"]]))}`),
    ).toBeNull();
  });

  it("offers the share sheet when the device has one", async () => {
    const user = userEvent.setup();
    const share = vi
      .fn()
      .mockRejectedValue(new DOMException("Cancelled", "AbortError"));
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    const writeText = stubClipboard();
    render(<SplitCalculator />);

    await user.type(screen.getByLabelText("Amount paid by person 1"), "100");
    await user.click(screen.getByRole("button", { name: SUBMIT }));
    await user.click(screen.getByRole("button", { name: "Share with the group" }));

    expect(share).toHaveBeenCalledWith({
      text: expect.stringContaining("Who pays whom"),
    });
    expect(writeText).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });
});
