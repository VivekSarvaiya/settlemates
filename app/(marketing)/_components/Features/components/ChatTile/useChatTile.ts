import { useInView } from "motion/react";
import { useId, useRef, useState } from "react";
import { isYou } from "@/components/shared/SplitCalculator/phrases";
import { buildShareMessage } from "@/components/shared/SplitCalculator/shareMessage";
import { buildSplitUrl } from "@/components/shared/SplitCalculator/splitLink";
import { formatCents } from "@/lib/currency";
import { useWebShare } from "@/lib/hooks/useWebShare";
import { CHAT_GROUP_NAME, COPY_STATUS_MESSAGES, MAX_AVATARS } from "./const";
import type { ChatReply, UseChatTileParams } from "./types";

export const useChatTile = ({ group, siteOrigin }: UseChatTileParams) => {
  const titleId = useId();
  const messageId = useId();
  const chatRef = useRef<HTMLDivElement>(null);
  const isChatInView = useInView(chatRef, { once: true, margin: "0px 0px -15% 0px" });
  const [isExpanded, setIsExpanded] = useState(false);
  const { copyStatus, copyText } = useWebShare();

  const { people, payments, totalCents, shareCents } = group;

  // Same builder as the calculator's "Copy for the group chat", so the preview is the real message.
  const messageFor = (origin: string) =>
    buildShareMessage({
      names: people.map((person) => person.name),
      paidCents: people.map((person) => person.paidCents),
      balancesCents: people.map((person) => person.balanceCents),
      transactions: payments,
      totalCents,
      shareCents,
      link: buildSplitUrl(origin, people),
    });

  const firstPayment = payments[0];
  let reply: ChatReply = {
    author: people[1]?.name ?? "Amit",
    text: "All square? Nice, nothing to send then.",
  };
  if (firstPayment) {
    const fromName = people[firstPayment.fromIndex]?.name ?? "";
    const toName = people[firstPayment.toIndex]?.name ?? "";
    reply = isYou(fromName)
      ? { author: toName, text: "Got it. Send it whenever you can." }
      : {
          author: fromName,
          text: `Sending ${formatCents(firstPayment.amountCents)} now. Thanks for sorting this out!`,
        };
  }

  const handleToggleExpanded = () => setIsExpanded((expanded) => !expanded);
  const handleCopy = () => copyText(messageFor(window.location.origin));

  return {
    titleId,
    messageId,
    chatRef,
    isChatInView,
    groupName: CHAT_GROUP_NAME,
    avatars: people.slice(0, MAX_AVATARS).map((person) => ({
      name: person.name,
      initial: person.name.charAt(0).toUpperCase(),
    })),
    hiddenAvatarCount: Math.max(people.length - MAX_AVATARS, 0),
    peopleLabel: `${people.length} people`,
    message: messageFor(siteOrigin),
    // The reply replays whenever the group changes, as if someone just read the new message.
    replyKey: people.map((person) => person.paidCents).join("-"),
    reply,
    isExpanded,
    isCopied: copyStatus === "copied",
    statusMessage: COPY_STATUS_MESSAGES[copyStatus],
    handleToggleExpanded,
    handleCopy,
  };
};
