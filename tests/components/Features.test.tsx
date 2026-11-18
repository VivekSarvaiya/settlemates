import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Features } from "@/app/(marketing)/_components/Features/Features";
import {
  buildSplitUrl,
  decodeSplitHash,
} from "@/components/shared/SplitCalculator/splitLink";

const HINT = "Hover or tap anyone to trace their money.";

const paymentRows = () =>
  within(screen.getByRole("list", { name: "Who pays whom" }))
    .getAllByRole("listitem")
    .map((row) => row.textContent);

const sharedPeople = () => {
  const href = screen.getByRole("button", { name: "Open this split" }).getAttribute("href") ?? "";
  return decodeSplitHash(href.slice(href.indexOf("#")));
};

beforeEach(() => {
  // Motion restores the scroll position after measuring layout values; jsdom doesn't implement scrollTo.
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Features bento grid", () => {
  it("settles the demo group with the real engine as people join and leave", async () => {
    const user = userEvent.setup();
    render(<Features />);

    expect(screen.getByText("4 payments")).toBeInTheDocument();
    expect(
      screen.getByText("settle ₹9,200 between 5 people. Never more than 4."),
    ).toBeInTheDocument();
    expect(paymentRows()).toEqual([
      "Amit pays you₹1,840",
      "Kabir pays Neha₹760",
      "Priya pays you₹340",
      "Kabir pays you₹180",
    ]);
    expect(sharedPeople()?.map((person) => person.name)).toEqual([
      "You",
      "Amit",
      "Priya",
      "Kabir",
      "Neha",
    ]);

    await user.click(screen.getByRole("button", { name: "Add one person to the group" }));
    await waitFor(() =>
      expect(paymentRows()).toEqual([
        "Amit pays you₹1,533.34",
        "Rohan pays you₹1,133.32",
        "Kabir pays Neha₹633.33",
        "Rohan pays Neha₹400.01",
        "Priya pays Neha₹33.33",
      ]),
    );
    expect(sharedPeople()).toHaveLength(6);

    const removePerson = screen.getByRole("button", { name: "Remove one person from the group" });
    for (let step = 0; step < 4; step += 1) await user.click(removePerson);

    expect(removePerson).toBeDisabled();
    expect(screen.getByText("1 payment")).toBeInTheDocument();
    await waitFor(() => expect(paymentRows()).toEqual(["Amit pays you₹2,100"]));
  });

  it("shows everyone square when a shuffle makes every receipt equal", async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    render(<Features />);

    await user.click(screen.getByRole("button", { name: "New receipts" }));

    expect(screen.getByText("All square")).toBeInTheDocument();
    expect(
      screen.getByText("Everyone paid the same, so nobody owes anything."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Who pays whom" })).not.toBeInTheDocument();
    expect(sharedPeople()?.every((person) => person.paidCents === 205_000)).toBe(true);

    const chat = within(screen.getByRole("article", { name: "Ready for the group chat" }));
    expect(chat.getByText(/Everyone's square — no payments needed\./)).toBeInTheDocument();
    expect(chat.getByText("All square? Nice, nothing to send then.")).toBeInTheDocument();
  });

  it("traces a payment on hover, and toggles it on tap", async () => {
    const user = userEvent.setup();
    render(<Features />);
    const tile = within(screen.getByRole("article", { name: "Who pays whom, not just a share" }));
    const row = tile.getByText("Kabir pays Neha").closest("li");
    if (!row) throw new Error("Payment row not found");

    await user.hover(row);
    expect(screen.getByText("Kabir pays Neha ₹760.")).toBeInTheDocument();
    await user.unhover(row);
    expect(screen.getByText(HINT)).toBeInTheDocument();

    await user.pointer({ keys: "[TouchA]", target: row });
    expect(screen.getByText("Kabir pays Neha ₹760.")).toBeInTheDocument();
    await user.pointer({ keys: "[TouchA]", target: row });
    expect(screen.getByText(HINT)).toBeInTheDocument();

    await user.hover(tile.getByText("A"));
    expect(screen.getByText("Amit paid ₹0 and owes ₹1,840.")).toBeInTheDocument();
    await user.hover(tile.getByText("Y"));
    expect(screen.getByText("You paid ₹4,200 and get back ₹2,360.")).toBeInTheDocument();
  });

  it("shows where the leftover paise go for each bill", async () => {
    const user = userEvent.setup();
    render(<Features />);
    const shares = () =>
      within(screen.getByRole("list", { name: "Shares" }))
        .getAllByRole("listitem")
        .map((row) => row.textContent);

    expect(shares()).toEqual(["You+1 paisa₹333.34", "Amit₹333.33", "Priya₹333.33"]);
    expect(screen.getByText("The extra ₹0.01 goes to you.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "₹2,999" }));
    const morePeople = screen.getByRole("button", { name: "Split the bill between more people" });
    for (let step = 0; step < 4; step += 1) await user.click(morePeople);

    expect(morePeople).toBeDisabled();
    expect(screen.getByRole("button", { name: "₹2,999" })).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText(
        "The extra ₹0.06 goes one paisa each to you, Amit, Priya, Kabir, Neha and Rohan.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "₹1,000" }));
    const fewerPeople = screen.getByRole("button", { name: "Split the bill between fewer people" });
    for (let step = 0; step < 3; step += 1) await user.click(fewerPeople);

    expect(screen.getByText("₹1,000 splits evenly 4 ways. Nothing left over.")).toBeInTheDocument();
    await waitFor(() => expect(shares()).toEqual(["You₹250", "Amit₹250", "Priya₹250", "Kabir₹250"]));
  });

  it("copies a link that reopens the demo split", async () => {
    const user = userEvent.setup();
    render(<Features />);

    await user.click(screen.getByRole("button", { name: "Copy link" }));

    const people = sharedPeople() ?? [];
    expect(await navigator.clipboard.readText()).toBe(
      buildSplitUrl(window.location.origin, people),
    );
    expect(
      await screen.findByText("Link copied. Paste it anywhere to share this split."),
    ).toBeInTheDocument();
    expect(screen.getByText("Opens with 5 people and ₹9,200 already filled in.")).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Split the link opens" }))
        .getAllByRole("listitem")
        .map((row) => row.textContent),
    ).toEqual(["Amit pays you₹1,840", "Kabir pays Neha₹760", "Priya pays you₹340", "+1 more"]);
  });

  it("previews the real group-chat message and copies it", async () => {
    const user = userEvent.setup();
    render(<Features />);
    const tile = within(screen.getByRole("article", { name: "Ready for the group chat" }));
    const bubble = tile.getByText(/₹9,200 split between 5 people/);

    expect(bubble.textContent).toContain("Amit paid ₹0 · owes ₹1,840");
    expect(bubble.textContent).toContain("Who pays whom\nAmit pays you ₹1,840");
    expect(bubble.textContent).toContain(
      "Open this split on SettleMates: https://settlemates.test/split-bill-calculator#split=",
    );
    expect(tile.getByText("Sending ₹1,840 now. Thanks for sorting this out!")).toBeInTheDocument();

    const readMore = tile.getByRole("button", { name: "Read more" });
    expect(readMore).toHaveAttribute("aria-expanded", "false");
    await user.click(readMore);
    expect(tile.getByRole("button", { name: "Show less" })).toHaveAttribute("aria-expanded", "true");

    await user.click(tile.getByRole("button", { name: "Copy message" }));
    expect(await navigator.clipboard.readText()).toBe(
      bubble.textContent?.replace("https://settlemates.test", window.location.origin),
    );
    expect(await tile.findByText("Message copied. Paste it in your group chat.")).toBeInTheDocument();
  });

});
