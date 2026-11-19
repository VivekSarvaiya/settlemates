import { ChartColumn, Link2, ServerOff, UserX } from "lucide-react";
import type { LegalHighlight } from "@/components/shared/LegalPage/types";

export const PRIVACY_PAGE = {
  title: "Privacy Policy",
  description:
    "What happens to your information on SettleMates: no account, your split never stored on our servers, and what our analytics can and can't see.",
  summary:
    "SettleMates is a free calculator, not an account-based app. This page explains, in plain language, what happens to your information when you use it.",
  updatedAt: "2026-11-19",
} as const;

export const PRIVACY_HIGHLIGHTS: LegalHighlight[] = [
  {
    icon: UserX,
    title: "No account",
    description: "You never sign up or give us your name, email or phone number.",
  },
  {
    icon: ServerOff,
    title: "Your split isn't stored",
    description:
      "The names and amounts you type stay in your browser. They aren't sent to us or saved on our servers.",
  },
  {
    icon: Link2,
    title: "You choose who sees it",
    description: "A shared split opens only for people who have its link.",
  },
  {
    icon: ChartColumn,
    title: "Analytics without your split",
    description:
      "We measure how the site is used. Analytics never receives the names or amounts in a split.",
  },
];
