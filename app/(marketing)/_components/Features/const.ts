import {
  ArrowLeftRight,
  Coins,
  Link2,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: Coins,
    title: "Split any way",
    description:
      "Equal, percentage, or exact amounts — with every leftover paisa accounted for, never silently dropped.",
  },
  {
    icon: Scale,
    title: "Balances that stay live",
    description:
      "Each expense instantly updates who owes whom, so the group never has to reconstruct the math later.",
  },
  {
    icon: ArrowLeftRight,
    title: "Smart settlement",
    description:
      "Everyone's debts get condensed into the smallest number of payments, each one explained in plain language.",
  },
  {
    icon: Link2,
    title: "Quick Split from a link",
    description:
      "Run a one-off bill without creating an account, then keep it if the group turns into a longer story.",
  },
  {
    icon: Users,
    title: "Trips, rent, and one-offs",
    description:
      "A weekend away, a shared flat, or a single dinner bill — the same people and the same running balance.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing hidden",
    description:
      "Every share shows how it was worked out, so anyone in the group can check the number and agree with it.",
  },
];
