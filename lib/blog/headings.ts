import { isValidElement, type ReactNode } from "react";
import { WORDS_PER_MINUTE } from "./const";
import type { PostHeading } from "./types";

const HEADING_LINE = /^(#{2,3})\s+(.+?)\s*#*\s*$/;
const FENCE_LINE = /^\s*(```|~~~)/;
const MARKDOWN_LINK = /!?\[([^\]]*)\]\([^)]*\)/g;
const IMPORT_LINE = /^import\s.*$/gm;
const FENCE_MARKER_LINE = /^\s*(```|~~~).*$/gm;
const JSX_TAG = /<\/?[A-Za-z][^>]*>/g;

export const stripInlineMarkdown = (text: string) =>
  text
    .replace(MARKDOWN_LINK, "$1")
    .replace(JSX_TAG, "")
    .replace(/\*\*|__|\*|`|~~/g, "")
    .trim();

// The TOC and the rendered heading both derive ids here, so links and anchors always match.
export const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
    .trim()
    .replace(/[\s-]+/g, "-");

export const textFromNode = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textFromNode(node.props.children);
  }
  return "";
};

export const extractHeadings = (source: string): PostHeading[] => {
  const headings: PostHeading[] = [];
  let isInCodeFence = false;

  for (const line of source.split("\n")) {
    if (FENCE_LINE.test(line)) {
      isInCodeFence = !isInCodeFence;
      continue;
    }
    const match = isInCodeFence ? null : HEADING_LINE.exec(line);
    if (!match) continue;

    const text = stripInlineMarkdown(match[2]);
    headings.push({
      depth: match[1].length === 2 ? 2 : 3,
      text,
      id: slugifyHeading(text),
    });
  }

  return headings;
};

export const findDuplicateHeadingIds = (headings: PostHeading[]) => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const { id } of headings) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return [...duplicates];
};

export const countWords = (source: string) =>
  source
    .replace(IMPORT_LINE, " ")
    .replace(FENCE_MARKER_LINE, " ")
    .replace(MARKDOWN_LINK, "$1")
    .replace(JSX_TAG, " ")
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

export const getReadingMinutes = (wordCount: number) =>
  Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
