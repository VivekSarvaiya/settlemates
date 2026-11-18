import { describe, expect, it } from "vitest";
import { getLegalSections, type LegalPageName } from "@/lib/contentPages";

const LEGAL_PAGES: LegalPageName[] = ["privacy", "terms"];

describe("legal page sections", () => {
  it.each(LEGAL_PAGES)("%s numbers its sections 1, 2, 3… with unique anchors", async (name) => {
    const sections = await getLegalSections(name);

    expect(sections.length).toBeGreaterThan(0);
    sections.forEach((section, index) => {
      expect(section.text).toMatch(new RegExp(`^${index + 1}\\. `));
    });
    expect(new Set(sections.map((section) => section.id)).size).toBe(sections.length);
  });
});
