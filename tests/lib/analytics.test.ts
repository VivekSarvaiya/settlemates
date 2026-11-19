import { describe, expect, it } from "vitest";
import { stripUrlFragment } from "@/lib/analytics";

describe("stripUrlFragment", () => {
  it("drops a shared split from the URL and keeps everything else", () => {
    expect(
      stripUrlFragment({
        type: "pageview",
        url: "https://settlemates.test/split-bill-calculator?utm_source=whatsapp#split=WyJZb3UiLDQyMDAwMF0",
      }),
    ).toEqual({
      type: "pageview",
      url: "https://settlemates.test/split-bill-calculator?utm_source=whatsapp",
    });
  });

  it("leaves URLs without a fragment alone", () => {
    const event = { type: "vital", url: "https://settlemates.test/blog", route: "/blog" };
    expect(stripUrlFragment(event)).toEqual(event);
  });
});
