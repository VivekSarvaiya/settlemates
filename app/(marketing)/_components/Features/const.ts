import { ArrowLeftRight, Coins, Link2, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: ArrowLeftRight,
    title: "Who pays whom, not just a share",
    description:
      "You get the actual transfers to make, in plain words. A group of six never needs more than five of them.",
  },
  {
    icon: Coins,
    title: "Every paisa accounted for",
    description:
      "When a bill doesn't divide evenly, the extra paisa go to the first person in the list and the result says so. Shares always add up to the total.",
  },
  {
    icon: Link2,
    title: "A link that reopens the split",
    description:
      "Copy or share the result and it comes with a link. Whoever opens it sees the same numbers, ready to check or edit.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "No account, and nothing stored on our servers. The split lives in your browser and inside the link you share.",
  },
];
