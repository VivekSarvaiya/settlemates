import type { StaticImageData } from "next/image";
import { z } from "zod";
import { AUTHOR_IDS } from "@/content/authors";
import {
  BLOG_CATEGORIES,
  POST_DESCRIPTION_LENGTH,
  POST_SLUG_PATTERN,
  POST_TITLE_LENGTH,
} from "./const";

const isStaticImage = (value: unknown): value is StaticImageData =>
  typeof value === "object" &&
  value !== null &&
  "src" in value &&
  "width" in value &&
  "height" in value;

export const postMetaSchema = z
  .object({
    title: z.string().trim().min(POST_TITLE_LENGTH.min).max(POST_TITLE_LENGTH.max),
    description: z
      .string()
      .trim()
      .min(POST_DESCRIPTION_LENGTH.min)
      .max(POST_DESCRIPTION_LENGTH.max),
    publishedAt: z.iso.date(),
    updatedAt: z.iso.date().optional(),
    category: z.enum(BLOG_CATEGORIES),
    authorId: z.enum(AUTHOR_IDS),
    draft: z.boolean().default(false),
    image: z
      .object({
        src: z.custom<StaticImageData>(
          isStaticImage,
          "Import the image file (import hero from \"./hero.jpg\") so its size is known.",
        ),
        alt: z.string().trim().min(1),
      })
      .optional(),
  })
  .refine((meta) => !meta.updatedAt || meta.updatedAt >= meta.publishedAt, {
    message: "updatedAt can't be earlier than publishedAt.",
    path: ["updatedAt"],
  });

export const isValidPostSlug = (slug: string) => POST_SLUG_PATTERN.test(slug);

export const parsePostMeta = (slug: string, meta: unknown) => {
  const result = postMetaSchema.safeParse(meta);
  if (!result.success) {
    throw new Error(
      `content/blog/${slug}/meta.ts: invalid meta.\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
};
