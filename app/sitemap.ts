import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts";
import { buildSitemap } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap(await getAllPosts());
}
