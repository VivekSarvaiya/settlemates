import type { StaticImageData } from "next/image";
import type { z } from "zod";
import type { postMetaSchema } from "./schema";

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: StaticImageData;
}

export type PostMeta = z.output<typeof postMetaSchema>;
export type PostMetaInput = z.input<typeof postMetaSchema>;

export interface PostHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface PostSummary {
  slug: string;
  meta: PostMeta;
  headings: PostHeading[];
  wordCount: number;
  readingMinutes: number;
}
