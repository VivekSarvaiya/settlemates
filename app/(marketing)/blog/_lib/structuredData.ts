import { ROUTES, blogPostPath } from "@/config/routes";
import { SITE_LANGUAGE } from "@/config/site";
import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/lib/blog/const";
import type { PostSummary } from "@/lib/blog/types";
import { absoluteUrl, buildBreadcrumbList, getPublisherReference } from "@/lib/seo";

export const buildBlogStructuredData = (publishedPosts: PostSummary[]) => {
  const blogUrl = absoluteUrl(ROUTES.blog);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${blogUrl}#blog`,
        name: BLOG_TITLE,
        description: BLOG_DESCRIPTION,
        url: blogUrl,
        inLanguage: SITE_LANGUAGE,
        publisher: getPublisherReference(),
        blogPost: publishedPosts.map((post) => ({
          "@type": "BlogPosting",
          "@id": `${absoluteUrl(blogPostPath(post.slug))}#article`,
          headline: post.meta.title,
          url: absoluteUrl(blogPostPath(post.slug)),
          datePublished: post.meta.publishedAt,
        })),
      },
      buildBreadcrumbList([
        { name: "Home", path: ROUTES.home },
        { name: "Blog", path: ROUTES.blog },
      ]),
    ],
  };
};
