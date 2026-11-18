export const BLOG_CATEGORIES = [
  "Guides",
  "Trips",
  "Flatmates",
  "Money basics",
] as const;

export const BLOG_TITLE = "SettleMates Blog";
export const BLOG_DESCRIPTION =
  "Plain guides to splitting bills, trips and flat expenses with friends, so everyone pays their fair share without the awkward follow-ups.";

export const POST_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const WORDS_PER_MINUTE = 200;
export const RELATED_POST_LIMIT = 3;
export const LATEST_POST_LIMIT = 3;
export const MIN_TOC_HEADINGS = 2;

export const POST_TITLE_LENGTH = { min: 10, max: 70 } as const;
export const POST_DESCRIPTION_LENGTH = { min: 50, max: 160 } as const;
