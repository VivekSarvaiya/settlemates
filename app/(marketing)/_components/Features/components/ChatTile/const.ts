import type { CopyStatus } from "@/lib/hooks/useWebShare";

export const CHAT_GROUP_NAME = "Weekend trip";
export const MAX_AVATARS = 4;

export const TYPING_DELAY = 0.8;
export const TYPING_DURATION = 1.4;

export const COPY_STATUS_MESSAGES: Record<CopyStatus, string> = {
  idle: "",
  copied: "Message copied. Paste it in your group chat.",
  error: "Couldn't copy the message. Select the text and copy it instead.",
};
