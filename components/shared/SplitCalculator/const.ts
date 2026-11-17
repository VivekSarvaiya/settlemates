export const MIN_PARTICIPANTS = 1;
export const MAX_PARTICIPANTS = 20;
export const DEFAULT_PEOPLE_COUNT = 4;
export const MAX_NAME_LENGTH = 40;

export const DEFAULT_NAMES = [
  "You",
  "Amit",
  "Priya",
  "Kabir",
  "Neha",
  "Rohan",
  "Sara",
  "Arjun",
  "Meera",
  "Dev",
];

export const AVATAR_TINTS = [
  "bg-primary/10 text-primary-text",
  "bg-foreground/10 text-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-muted text-muted-foreground",
  "bg-primary/15 text-primary-text",
  "bg-foreground/5 text-foreground",
];

export const STAGE_COPY = {
  setup: "Tap a name to rename it, then add what each person paid.",
  result: "Everyone's share, worked out.",
} as const;

export const BALANCE_TONE_CLASSES = {
  credit: "text-primary-text",
  debit: "text-destructive",
  square: "text-muted-foreground",
} as const;

export const SPLIT_HASH_PARAM = "split";
