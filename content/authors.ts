import type { Author } from "@/lib/blog/types";

// Placeholder founder profile: replace name, bio and add a photo before the first post goes live.
export const AUTHORS = {
  founder: {
    id: "founder",
    name: "Name",
    role: "Founder of SettleMates",
    bio: "Builds SettleMates and writes its guides on splitting bills, trips and shared flats.",
  },
} as const satisfies Record<string, Author>;

export type AuthorId = keyof typeof AUTHORS;

export const AUTHOR_IDS = Object.keys(AUTHORS) as [AuthorId, ...AuthorId[]];
