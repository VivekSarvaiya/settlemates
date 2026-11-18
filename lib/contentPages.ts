import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractHeadings } from "@/lib/blog/headings";

export type LegalPageName = "privacy" | "terms";

export interface LegalSection {
  id: string;
  text: string;
}

// Literal path segments keep Turbopack's file tracing scoped to content/pages.
const pagesRoot = path.join(process.cwd(), "content", "pages");

export const getLegalSections = async (name: LegalPageName): Promise<LegalSection[]> => {
  const source = await readFile(path.join(pagesRoot, `${name}.mdx`), "utf8");
  return extractHeadings(source)
    .filter((heading) => heading.depth === 2)
    .map(({ id, text }) => ({ id, text }));
};
