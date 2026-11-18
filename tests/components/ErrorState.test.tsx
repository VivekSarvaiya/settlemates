import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "@/app/_components";

describe("ErrorState", () => {
  it("explains the failure and offers a retry and a way home", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "That didn't add up." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
