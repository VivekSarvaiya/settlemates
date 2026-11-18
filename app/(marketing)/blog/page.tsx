import type { Metadata } from "next";
import { PostCard } from "@/components/blog";
import { CtaCard } from "@/components/mdx";
import { JsonLd } from "@/components/shared";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/config/routes";
import { SITE_NAME, SITE_OG_LOCALE } from "@/config/site";
import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/lib/blog/const";
import { getAllPosts } from "@/lib/blog/posts";
import { getPublishedPosts } from "@/lib/blog/select";
import { BLOG_PAGE } from "./_lib/const";
import { buildBlogStructuredData } from "./_lib/structuredData";

const SOCIAL_TITLE = `${BLOG_PAGE.title} — ${SITE_NAME}`;

export async function generateMetadata(): Promise<Metadata> {
  const hasPublishedPosts = getPublishedPosts(await getAllPosts()).length > 0;

  return {
    title: BLOG_PAGE.title,
    description: BLOG_DESCRIPTION,
    alternates: {
      canonical: ROUTES.blog,
      types: { "application/rss+xml": [{ url: ROUTES.blogFeed, title: BLOG_TITLE }] },
    },
    robots: hasPublishedPosts ? undefined : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: ROUTES.blog,
      siteName: SITE_NAME,
      locale: SITE_OG_LOCALE,
      title: SOCIAL_TITLE,
      description: BLOG_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: SOCIAL_TITLE,
      description: BLOG_DESCRIPTION,
    },
  };
}

export default async function BlogPage() {
  const posts = await getAllPosts();
  const publishedPosts = getPublishedPosts(posts);
  const [featuredPost, ...otherPosts] = posts;

  return (
    <>
      {publishedPosts.length > 0 && (
        <JsonLd data={buildBlogStructuredData(publishedPosts)} />
      )}
      <section className="border-b border-border py-12 md:py-20">
        <Container className="flex flex-col gap-4">
          <span className="text-sm text-primary-text">{BLOG_PAGE.eyebrow}</span>
          <h1 className="max-w-3xl text-display-lg font-medium text-balance">
            {BLOG_PAGE.heading}
          </h1>
          <p className="max-w-2xl text-lead text-muted-foreground">{BLOG_DESCRIPTION}</p>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container className="flex flex-col gap-6">
          {featuredPost ? (
            <>
              <PostCard post={featuredPost} isFeatured />
              {otherPosts.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {otherPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="max-w-2xl">
              <CtaCard
                title={BLOG_PAGE.emptyTitle}
                description={BLOG_PAGE.emptyDescription}
              />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
