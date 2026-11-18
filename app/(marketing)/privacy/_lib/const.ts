import { Cookie, EyeOff, ServerOff, UserX } from "lucide-react";
import type { LegalHighlight } from "@/components/shared/LegalPage/types";

export const PRIVACY_PAGE = {
  title: "Privacy Policy",
  description:
    "What happens to your information on SettleMates: no accounts, no cookies, no tracking, and nothing you type stored on our servers.",
  summary:
    "SettleMates is a free calculator, not an account-based app. This page explains, in plain language, what happens to your information when you use it.",
  updatedAt: "2026-11-18",
} as const;

export const PRIVACY_HIGHLIGHTS: LegalHighlight[] = [
  {
    icon: UserX,
    title: "No account",
    description: "You never sign up or give us your name, email or phone number.",
  },
  {
    icon: ServerOff,
    title: "Nothing stored",
    description: "What you type stays in your browser. It isn't sent to us or saved on our servers.",
  },
  {
    icon: Cookie,
    title: "No cookies",
    description: "The site doesn't set cookies to recognise or follow you.",
  },
  {
    icon: EyeOff,
    title: "No tracking",
    description: "No analytics, no advertising trackers and no third-party scripts.",
  },
];
