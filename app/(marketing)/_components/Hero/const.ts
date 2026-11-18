import type { HeroHeadline } from "./types";

export const HERO_HOOKS = [
  "No sign-up",
  "No app",
  "Splits never saved",
  "Free",
];

export const DEFAULT_HEADLINE: HeroHeadline = {
  key: "default",
  before: "Split expenses, not friendships.",
  amount: null,
  detail:
    "Who owes what, in ten seconds. Type what everyone paid and the answer appears right here. No awkward “bro, you still owe me.”",
};

export const SQUARE_HEADLINE: HeroHeadline = {
  key: "square",
  before: "Everyone's square.",
  amount: null,
  detail: "Everyone paid their share already, so nobody owes anybody.",
};
