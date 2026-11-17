import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Hero } from "@/app/(marketing)/_components/Hero/Hero";

async function typePaid(
  user: ReturnType<typeof userEvent.setup>,
  person: number,
  amount: string,
) {
  await user.type(screen.getByLabelText(`Amount paid by person ${person}`), amount);
}

describe("Hero", () => {
  it("shows the tagline until someone has paid", () => {
    render(<Hero />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Split expenses, not friendships.",
      }),
    ).toBeInTheDocument();
  });

  it("turns the headline into what the visitor is owed", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    await typePaid(user, 1, "2400");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Amit owes you ₹600." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Plus 2 more payments to settle everyone up."),
    ).toBeInTheDocument();
  });

  it("leads with what the visitor owes when they underpaid", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    await user.click(screen.getByRole("button", { name: "Remove one person" }));
    await user.click(screen.getByRole("button", { name: "Remove one person" }));
    await typePaid(user, 2, "500");

    expect(
      await screen.findByRole("heading", { level: 1, name: "You owe Amit ₹250." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("That's the only payment needed to settle up."),
    ).toBeInTheDocument();
  });

  it("names both people once the first person is renamed", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    const firstName = screen.getByLabelText("Name for person 1");
    await user.clear(firstName);
    await user.type(firstName, "Sam");
    await typePaid(user, 1, "400");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Amit owes Sam ₹100." }),
    ).toBeInTheDocument();
  });

  it("says everyone is square when the payments already match", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    for (let person = 1; person <= 4; person += 1) {
      await typePaid(user, person, "100");
    }

    expect(
      await screen.findByRole("heading", { level: 1, name: "Everyone's square." }),
    ).toBeInTheDocument();
  });
});
