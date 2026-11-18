import type { ComponentType } from "react";

interface PostContentModule {
  default: ComponentType;
}

// Kept apart from ./posts so pages that only list posts never bundle the MDX or its components.
export const loadPostContent = async (slug: string) => {
  const postModule: PostContentModule = await import(`@/content/blog/${slug}/index.mdx`);
  return postModule.default;
};
