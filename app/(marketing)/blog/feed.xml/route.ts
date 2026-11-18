import { buildRssFeed } from "@/lib/blog/feed";
import { getAllPosts } from "@/lib/blog/posts";

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildRssFeed(await getAllPosts()), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
