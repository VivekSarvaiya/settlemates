import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const runThemeScript = () => new Function(THEME_INIT_SCRIPT)();
const isDark = () => document.documentElement.classList.contains("dark");

describe("THEME_INIT_SCRIPT", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    vi.restoreAllMocks();
  });

  it.each([
    { saved: "dark", systemDark: false, expected: true },
    { saved: "light", systemDark: true, expected: false },
    { saved: null, systemDark: true, expected: true },
    { saved: null, systemDark: false, expected: false },
  ])(
    "saved $saved with a dark system $systemDark gives dark $expected",
    ({ saved, systemDark, expected }) => {
      if (saved) localStorage.setItem("theme", saved);
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: systemDark,
      } as MediaQueryList);

      runThemeScript();

      expect(isDark()).toBe(expected);
    },
  );

  it("leaves the page light when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });

    expect(runThemeScript).not.toThrow();
    expect(isDark()).toBe(false);
  });
});
