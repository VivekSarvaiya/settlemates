import { CircleCheck, Link, Scale, Wallet } from "lucide-react";
import type { LegalHighlight } from "@/components/shared/LegalPage/types";

export const TERMS_PAGE = {
  title: "Terms of Use",
  description:
    "The plain-language terms for using SettleMates, the free tool that works out who pays whom.",
  summary:
    "The plain-language terms for using SettleMates, the free tool that works out who pays whom. By using the site, you agree to them.",
  updatedAt: "2026-11-18",
} as const;

export const TERMS_HIGHLIGHTS: LegalHighlight[] = [
  {
    icon: Wallet,
    title: "We never touch your money",
    description: "SettleMates works out who pays whom. The payments happen in your own UPI or bank app.",
  },
  {
    icon: CircleCheck,
    title: "Check before you pay",
    description: "Results depend on the numbers you enter, so check amounts before paying anyone.",
  },
  {
    icon: Link,
    title: "Shared links are visible",
    description: "Anyone with a split link can see the names and amounts in it.",
  },
  {
    icon: Scale,
    title: "Indian law applies",
    description: "These terms are governed by the laws of India.",
  },
];
