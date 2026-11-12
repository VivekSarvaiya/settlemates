import type { SplitModeOption } from "./types";

export const MIN_PARTICIPANTS = 1;
export const MAX_PARTICIPANTS = 10;
export const DEFAULT_PEOPLE_COUNT = 4;

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

export const SPLIT_MODE_OPTIONS: SplitModeOption[] = [
  { value: "equal", label: "Equal", description: "Everyone pays the same share." },
  { value: "percentage", label: "Percentage", description: "Give each person a share of 100%." },
  { value: "exact", label: "Amount", description: "Enter exactly what each person pays." },
];
