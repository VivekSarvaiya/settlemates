import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SharePost } from "@/app/(marketing)/blog/[slug]/_components";

const TITLE = "How to split rent fairly";
const URL = "https://settlemates.test/blog/split-rent";

function stubClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  return writeText;
}

afterEach(() => {
  Reflect.deleteProperty(navigator, "share");
});

describe("SharePost", () => {
  it("copies the link and offers WhatsApp when there's no share sheet", async () => {
    const user = userEvent.setup();
    const writeText = stubClipboard();
    render(<SharePost title={TITLE} url={URL} />);

    expect(screen.queryByRole("button", { name: "Share" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /WhatsApp/ })).toHaveAttribute(
      "href",
      `https://wa.me/?text=${encodeURIComponent(`${TITLE} ${URL}`)}`,
    );

    await user.click(screen.getByRole("button", { name: "Copy link" }));
    expect(writeText).toHaveBeenCalledWith(URL);
    expect(await screen.findByText("Link copied.")).toBeInTheDocument();
  });

  it("opens the share sheet, and falls back to copying if it fails", async () => {
    const user = userEvent.setup();
    const writeText = stubClipboard();
    const share = vi.fn().mockRejectedValue(new Error("Share failed"));
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    render(<SharePost title={TITLE} url={URL} />);

    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(share).toHaveBeenCalledWith({ title: TITLE, url: URL });
    expect(writeText).toHaveBeenCalledWith(URL);
  });

  it("does nothing more when the share sheet is cancelled", async () => {
    const user = userEvent.setup();
    const writeText = stubClipboard();
    const share = vi.fn().mockRejectedValue(new DOMException("Cancelled", "AbortError"));
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    render(<SharePost title={TITLE} url={URL} />);

    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(writeText).not.toHaveBeenCalled();
  });
});
