import { HandCoins, IndianRupee, ShieldCheck, Zap } from "lucide-react";
import type { Principle } from "./types";

export const PRINCIPLES: Principle[] = [
  {
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "You don't make an account, and nothing you type is stored on our servers.",
  },
  {
    icon: IndianRupee,
    title: "Exact, not roughly right",
    description:
      "Amounts are worked out in paisa, and the result tells you where any leftover paisa went.",
  },
  {
    icon: HandCoins,
    title: "As few payments as possible",
    description:
      "We match who owes with who's owed, so settling up takes a handful of transfers, not one per expense.",
  },
  {
    icon: Zap,
    title: "Free and instant",
    description: "No app to install and nothing to pay. Open the page, type the numbers, done.",
  },
];
