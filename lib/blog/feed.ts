import { ROUTES, blogPostPath } from "@/config/routes";
import { SITE_LANGUAGE } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
import { BLOG_DESCRIPTION, BLOG_TITLE } from "./const";
import { getLastModified, getPublishedPosts } from "./select";
import type { PostSummary } from "./types";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toRfc822 = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`).toUTCString();

export const buildRssFeed = (posts: PostSummary[]) => {
  const publishedPosts = getPublishedPosts(posts);
  const items = publishedPosts.map((post) => {
    const url = absoluteUrl(blogPostPath(post.slug));
    return [
      "<item>",
      `<title>${escapeXml(post.meta.title)}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="true">${url}</guid>`,
      `<description>${escapeXml(post.meta.description)}</description>`,
      `<category>${escapeXml(post.meta.category)}</category>`,
      `<pubDate>${toRfc822(post.meta.publishedAt)}</pubDate>`,
      "</item>",
    ].join("");
  });
  const lastBuildDate =
    publishedPosts.length > 0
      ? `<lastBuildDate>${toRfc822(getLastModified(publishedPosts[0].meta))}</lastBuildDate>`
      : "";

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(BLOG_TITLE)}</title>`,
    `<link>${absoluteUrl(ROUTES.blog)}</link>`,
    `<description>${escapeXml(BLOG_DESCRIPTION)}</description>`,
    `<language>${SITE_LANGUAGE}</language>`,
    `<atom:link href="${absoluteUrl(ROUTES.blogFeed)}" rel="self" type="application/rss+xml"/>`,
    lastBuildDate,
    ...items,
    "</channel>",
    "</rss>",
  ].join("\n");
};
