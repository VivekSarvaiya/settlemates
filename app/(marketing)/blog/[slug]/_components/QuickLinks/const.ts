import { ROUTES } from "@/config/routes";
import type { QuickLink } from "./types";

export const QUICK_LINKS: QuickLink[] = [
  {
    label: "Split bill calculator",
    description: "Type what everyone paid and see who pays whom.",
    href: ROUTES.splitBillCalculator,
  },
  {
    label: "All guides",
    description: "Every article on splitting money with friends.",
    href: ROUTES.blog,
  },
  {
    label: "How it works",
    description: "Six friends, one trip, four payments to settle it.",
    href: "/#how-it-works",
  },
  {
    label: "Questions, answered",
    description: "Plain answers about how SettleMates works.",
    href: "/#faq",
  },
];
