import type { AboutFact } from "./types";

export const ABOUT_HERO = {
  eyebrow: "About SettleMates",
  heading: "Built for the moment the bill arrives.",
  lead: "SettleMates is a free split bill calculator. Type what everyone paid and it shows the exact payments that settle the group, down to the paisa. No sign-up, no app, and nothing stored on our servers.",
} as const;

export const ABOUT_FACTS: AboutFact[] = [
  { value: "₹0", label: "to use" },
  { value: "0", label: "accounts or apps needed" },
  { value: "20", label: "people in one split" },
  { value: "n − 1", label: "the most payments a group of n ever needs" },
];
