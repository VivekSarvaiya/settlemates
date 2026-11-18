import { ArrowLeftRight, Coins, Link2, MessagesSquare } from "lucide-react";
import type { Feature, FeatureId } from "./types";

export const FEATURES = {
  settlement: {
    icon: ArrowLeftRight,
    title: "Who pays whom, not just a share",
    description:
      "You get the actual transfers to make, in plain words. However the bill fell, a group never needs more payments than it has people, minus one.",
  },
  paisa: {
    icon: Coins,
    title: "Every paisa accounted for",
    description:
      "When a bill doesn't divide evenly, the leftover paise go one each to the first people in the list. Shares always add up to the total.",
  },
  shareLink: {
    icon: Link2,
    title: "A link that reopens the split",
    description:
      "Copy or share the result and it comes with a link. Whoever opens it sees the same numbers, ready to check or edit.",
  },
  chat: {
    icon: MessagesSquare,
    title: "Ready for the group chat",
    description:
      "Copy the result as one message in plain words, with a link that reopens the split. Paste it wherever your group talks.",
  },
} satisfies Record<FeatureId, Feature>;
