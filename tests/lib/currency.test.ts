import { describe, expect, it } from "vitest";
import {
  formatAmountInput,
  formatCents,
  parseAmountToCents,
} from "@/lib/currency";

describe("formatCents", () => {
  it("keeps whole rupees clean and always shows two paise digits otherwise", () => {
    expect(formatCents(60_000)).toBe("₹600");
    expect(formatCents(76_250)).toBe("₹762.50");
    expect(formatCents(3_334)).toBe("₹33.34");
    expect(formatCents(1_234_567_800)).toBe("₹1,23,45,678");
  });
});

describe("formatAmountInput", () => {
  it("groups digits the Indian way and parses back to the same amount", () => {
    for (const cents of [0, 50, 123_456_789, 1_000_000_00]) {
      const text = formatAmountInput(cents);
      expect(text).not.toContain("₹");
      expect(parseAmountToCents(text)).toBe(cents);
    }
    expect(formatAmountInput(123_456_789)).toBe("12,34,567.89");
  });
});
