import { ROUTES, authorPath, blogPostPath } from "@/config/routes";
import { SITE_LANGUAGE } from "@/config/site";
import { getLastModified } from "@/lib/blog/select";
import type { Author, PostSummary } from "@/lib/blog/types";
import { absoluteUrl, buildBreadcrumbList, getPublisherReference } from "@/lib/seo";

export const buildPostStructuredData = (post: PostSummary, author: Author) => {
  const { meta } = post;
  const url = absoluteUrl(blogPostPath(post.slug));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: meta.title,
        description: meta.description,
        url,
        mainEntityOfPage: url,
        datePublished: meta.publishedAt,
        dateModified: getLastModified(meta),
        inLanguage: SITE_LANGUAGE,
        articleSection: meta.category,
        wordCount: post.wordCount,
        image: meta.image ? absoluteUrl(meta.image.src.src) : undefined,
        author: {
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          url: absoluteUrl(authorPath(author.id)),
        },
        publisher: getPublisherReference(),
      },
      buildBreadcrumbList([
        { name: "Home", path: ROUTES.home },
        { name: "Blog", path: ROUTES.blog },
        { name: meta.title, path: blogPostPath(post.slug) },
      ]),
    ],
  };
};
