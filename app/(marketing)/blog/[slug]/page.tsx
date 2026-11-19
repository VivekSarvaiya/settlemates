import { CtaCard } from "@/components/mdx";
import { JsonLd } from "@/components/shared";
import { Container } from "@/components/ui/container";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { authorPath, blogPostPath } from "@/config/routes";
import { SITE_NAME, SITE_OG_LOCALE } from "@/config/site";
import { AUTHORS } from "@/content/authors";
import { POST_ARTICLE_ID, RELATED_POST_LIMIT } from "@/lib/blog/const";
import { loadPostContent } from "@/lib/blog/content";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import { getLastModified, getRelatedPosts } from "@/lib/blog/select";
import { absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  AuthorBox,
  PostHeader,
  QuickLinks,
  RelatedPosts,
  SharePost,
  TableOfContents,
} from "./_components";
import { buildPostStructuredData } from "./_lib/structuredData";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const { meta } = post;
  const socialTitle = `${meta.title} — ${SITE_NAME}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: blogPostPath(slug) },
    robots: meta.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: blogPostPath(slug),
      siteName: SITE_NAME,
      locale: SITE_OG_LOCALE,
      title: socialTitle,
      description: meta.description,
      publishedTime: meta.publishedAt,
      modifiedTime: getLastModified(meta),
      authors: [absoluteUrl(authorPath(meta.authorId))],
      section: meta.category,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: meta.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [Content, allPosts] = await Promise.all([
    loadPostContent(slug),
    getAllPosts(),
  ]);
  const author = AUTHORS[post.meta.authorId];
  const relatedPosts = getRelatedPosts(post, allPosts, RELATED_POST_LIMIT);

  return (
    <>
      <JsonLd data={buildPostStructuredData(post, author)} />
      <ScrollProgress targetId={POST_ARTICLE_ID} className="top-16" />
      <article id={POST_ARTICLE_ID} className="py-10 md:py-16">
        <Container className="flex flex-col gap-10 md:gap-12">
          <PostHeader post={post} author={author} />

          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-4 lg:gap-12">
            <div className="flex min-w-0 flex-col gap-10 lg:col-span-3">
              {post.meta.image && (
                <Image
                  src={post.meta.image.src}
                  alt={post.meta.image.alt}
                  sizes="(min-width: 1024px) 860px, 100vw"
                  loading="eager"
                  fetchPriority="high"
                  placeholder={
                    post.meta.image.src.blurDataURL ? "blur" : "empty"
                  }
                  className="h-auto w-full rounded border border-border"
                />
              )}
              <div className="lg:hidden">
                <TableOfContents
                  headings={post.headings}
                  variant="collapsible"
                />
              </div>
              <div className="flex max-w-2xl flex-col gap-6">
                <Content />
              </div>
              <div className="flex max-w-2xl flex-col gap-10">
                <CtaCard />
                <SharePost
                  title={post.meta.title}
                  url={absoluteUrl(blogPostPath(slug))}
                />
                <AuthorBox author={author} />
              </div>
            </div>

            <aside className="hidden lg:block">
              <TableOfContents headings={post.headings} variant="sidebar" />
            </aside>
          </div>
        </Container>
      </article>
      <section
        aria-label="Read next"
        className="border-t border-border bg-muted/40 py-16 md:py-20"
      >
        <Container className="flex flex-col gap-14">
          <RelatedPosts posts={relatedPosts} />
          <QuickLinks />
        </Container>
      </section>
    </>
  );
}
