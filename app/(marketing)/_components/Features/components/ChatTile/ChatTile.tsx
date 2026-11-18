"use client";

import { Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/animation";
import { FEATURES } from "../../const";
import { BentoTile } from "../BentoTile/BentoTile";
import { TileHeader } from "../TileHeader/TileHeader";
import { TYPING_DELAY, TYPING_DURATION } from "./const";
import type { ChatTileProps } from "./types";
import { useChatTile } from "./useChatTile";

export function ChatTile({ group, siteOrigin }: ChatTileProps) {
  const {
    titleId,
    messageId,
    chatRef,
    isChatInView,
    groupName,
    avatars,
    hiddenAvatarCount,
    peopleLabel,
    message,
    replyKey,
    reply,
    isExpanded,
    isCopied,
    statusMessage,
    handleToggleExpanded,
    handleCopy,
  } = useChatTile({ group, siteOrigin });

  return (
    <BentoTile labelledBy={titleId} tone="inverse">
      <TileHeader id={titleId} feature={FEATURES.chat} tone="inverse" />

      <div className="mt-auto flex flex-col gap-4">
        <section
          ref={chatRef}
          aria-label="Group chat preview"
          className="flex flex-col gap-3 rounded-lg border border-inverse-foreground/10 bg-inverse-foreground/5 p-4"
        >
          <div className="flex items-center gap-3 border-b border-inverse-foreground/10 pb-3">
            <div aria-hidden="true" className="flex -space-x-2">
              {avatars.map((avatar) => (
                <span
                  key={avatar.name}
                  className="flex size-7 items-center justify-center rounded-full border-2 border-inverse bg-inverse-foreground/15 text-xs font-medium"
                >
                  {avatar.initial}
                </span>
              ))}
              {hiddenAvatarCount > 0 && (
                <span className="flex size-7 items-center justify-center rounded-full border-2 border-inverse bg-primary text-xs font-medium text-primary-foreground">
                  +{hiddenAvatarCount}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-medium">{groupName}</span>
              <span className="text-xs text-inverse-foreground/60">{peopleLabel}</span>
            </div>
          </div>

          <motion.div
            data-reveal
            className="flex max-w-[90%] flex-col self-end rounded-2xl rounded-br-sm bg-primary px-3.5 pt-2.5 pb-1.5 text-sm text-primary-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={isChatInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <div
              className={cn(
                "relative overflow-hidden transition-[max-height] duration-500",
                isExpanded ? "max-h-192" : "max-h-36",
              )}
            >
              <p id={messageId} className="whitespace-pre-line wrap-anywhere">
                {message}
              </p>
              {!isExpanded && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-primary to-transparent"
                />
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              aria-expanded={isExpanded}
              aria-controls={messageId}
              className="-ml-2 w-fit text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={handleToggleExpanded}
            >
              {isExpanded ? "Show less" : "Read more"}
            </Button>
          </motion.div>

          <div className="grid justify-items-start">
            <motion.div
              key={`typing:${replyKey}`}
              aria-hidden="true"
              className="col-start-1 row-start-1 flex items-center gap-1 rounded-2xl rounded-bl-sm bg-inverse-foreground/10 px-3.5 py-3"
              initial={{ opacity: 0 }}
              animate={isChatInView ? { opacity: [0, 1, 1, 0] } : undefined}
              transition={{
                duration: TYPING_DURATION,
                times: [0, 0.1, 0.9, 1],
                delay: TYPING_DELAY,
              }}
            >
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="size-1.5 rounded-full bg-inverse-foreground/60"
                  animate={isChatInView ? { y: [0, -3, 0] } : undefined}
                  transition={{ duration: 0.45, repeat: 2, delay: TYPING_DELAY + dot * 0.12 }}
                />
              ))}
            </motion.div>
            <motion.div
              key={`reply:${replyKey}`}
              data-reveal
              className="col-start-1 row-start-1 flex max-w-[85%] flex-col gap-0.5 rounded-2xl rounded-bl-sm bg-inverse-foreground/10 px-3.5 py-2.5 text-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={isChatInView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.35,
                delay: TYPING_DELAY + TYPING_DURATION,
                ease: EASE_OUT,
              }}
            >
              <span className="text-xs font-medium text-inverse-foreground/60">
                {reply.author}
              </span>
              <span>{reply.text}</span>
            </motion.div>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="px-4"
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check aria-hidden="true" data-icon="inline-start" />
            ) : (
              <Copy aria-hidden="true" data-icon="inline-start" />
            )}
            {isCopied ? "Copied" : "Copy message"}
          </Button>
          <p aria-live="polite" className="text-sm text-inverse-foreground/70">
            {statusMessage}
          </p>
        </div>
      </div>
    </BentoTile>
  );
}
