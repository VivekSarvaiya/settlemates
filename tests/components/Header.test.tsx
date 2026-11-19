import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Header } from "@/app/(marketing)/_components/Header/Header";

// Outside the Next router usePathname() is null, and the header reads the current route.
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("Header", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("switches the theme and saves it under the key the <head> script reads", async () => {
    const user = userEvent.setup();
    render(<Header isBlogVisible />);
    const toggle = screen.getByRole("button", { name: "Toggle theme" });

    await user.click(toggle);
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");

    await user.click(toggle);
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
