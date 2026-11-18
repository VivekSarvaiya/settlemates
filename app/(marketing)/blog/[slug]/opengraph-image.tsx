import { notFound } from "next/navigation";
import { renderOgImage } from "@/components/shared/OgImage/OgImage";
import { formatReadingTime } from "@/lib/blog/format";
import { getPostBySlug } from "@/lib/blog/posts";

export { OG_ARTICLE_ALT as alt, OG_IMAGE_SIZE as size } from "@/components/shared/OgImage/const";
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return renderOgImage({
    eyebrow: `${post.meta.category} · ${formatReadingTime(post.readingMinutes)}`,
    title: post.meta.title,
  });
}
