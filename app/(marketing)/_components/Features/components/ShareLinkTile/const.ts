import type { CopyStatus } from "@/lib/hooks/useWebShare";

export const COPY_STATUS_MESSAGES: Record<CopyStatus, string> = {
  idle: "",
  copied: "Link copied. Paste it anywhere to share this split.",
  error: "Couldn't copy the link. Open it instead and copy it from the address bar.",
};

export const PREVIEW_PAYMENTS = 3;
