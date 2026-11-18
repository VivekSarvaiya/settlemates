export const ROUTES = {
  home: "/",
  splitBillCalculator: "/split-bill-calculator",
  blog: "/blog",
  blogFeed: "/blog/feed.xml",
  about: "/about",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export const blogPostPath = (slug: string) => `${ROUTES.blog}/${slug}`;

export const authorPath = (authorId: string) => `${ROUTES.about}#${authorId}`;
