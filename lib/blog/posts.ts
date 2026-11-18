import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { canShowDrafts } from "@/config/env";
import {
  countWords,
  extractHeadings,
  findDuplicateHeadingIds,
  getReadingMinutes,
} from "./headings";
import { isValidPostSlug, parsePostMeta } from "./schema";
import { isPostVisible, sortPostsByNewest } from "./select";
import type { PostSummary } from "./types";

interface PostMetaModule {
  meta?: unknown;
}

// Literal path segments let Turbopack trace only content/blog instead of the whole project.
const contentRoot = path.join(process.cwd(), "content", "blog");

// Listing reads meta.ts only; index.mdx is imported from ./content, which only the post page uses.
const importPostMeta = (slug: string): Promise<PostMetaModule> =>
  import(`@/content/blog/${slug}/meta.ts`);

const loadPostSummary = async (slug: string): Promise<PostSummary> => {
  if (!isValidPostSlug(slug)) {
    throw new Error(
      `content/blog/${slug}: folder names must be lowercase words joined by hyphens.`,
    );
  }

  const [source, metaModule] = await Promise.all([
    readFile(path.join(contentRoot, slug, "index.mdx"), "utf8"),
    importPostMeta(slug),
  ]);
  const meta = parsePostMeta(slug, metaModule.meta);
  const headings = extractHeadings(source);
  const duplicateIds = findDuplicateHeadingIds(headings);
  if (duplicateIds.length > 0) {
    throw new Error(
      `content/blog/${slug}: headings share the anchor "${duplicateIds.join('", "')}". Reword one of them.`,
    );
  }

  const wordCount = countWords(source);
  return {
    slug,
    meta,
    headings,
    wordCount,
    readingMinutes: getReadingMinutes(wordCount),
  };
};

// Newest first, drafts only where canShowDrafts allows. Any invalid post throws, failing the build.
export const getAllPosts = cache(async (): Promise<PostSummary[]> => {
  const entries = await readdir(contentRoot, { withFileTypes: true });
  const slugs = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name);
  const posts = await Promise.all(slugs.map(loadPostSummary));
  return sortPostsByNewest(posts.filter((post) => isPostVisible(post, canShowDrafts)));
});

export const getPostBySlug = async (slug: string) =>
  (await getAllPosts()).find((post) => post.slug === slug) ?? null;
