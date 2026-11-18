import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { ROUTES, blogPostPath } from "@/config/routes";
import { SITE_NAME } from "@/config/site";
import { getLastModified } from "@/lib/blog/select";
import type { PostSummary } from "@/lib/blog/types";

export const absoluteUrl = (path: string) => new URL(path, env.SITE_URL).toString();

export const getOrganizationId = () => `${absoluteUrl(ROUTES.home)}#organization`;

export const getPublisherReference = () => ({
  "@type": "Organization",
  "@id": getOrganizationId(),
  name: SITE_NAME,
  url: absoluteUrl(ROUTES.home),
});

export const buildBreadcrumbList = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

// Drafts never reach the sitemap, even on preview deploys where they render.
export const buildSitemap = (posts: PostSummary[]): MetadataRoute.Sitemap => {
  const publishedPosts = posts.filter((post) => !post.meta.draft);
  const blogEntries: MetadataRoute.Sitemap =
    publishedPosts.length === 0
      ? []
      : [
          {
            url: absoluteUrl(ROUTES.blog),
            lastModified: getLastModified(publishedPosts[0].meta),
          },
          ...publishedPosts.map((post) => ({
            url: absoluteUrl(blogPostPath(post.slug)),
            lastModified: getLastModified(post.meta),
          })),
        ];

  return [
    { url: absoluteUrl(ROUTES.home) },
    { url: absoluteUrl(ROUTES.splitBillCalculator) },
    ...blogEntries,
    { url: absoluteUrl(ROUTES.about) },
    { url: absoluteUrl(ROUTES.privacy) },
    { url: absoluteUrl(ROUTES.terms) },
  ];
};
