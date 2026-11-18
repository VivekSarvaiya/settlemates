import { useEffect, useState, useSyncExternalStore } from "react";

export type CopyStatus = "idle" | "copied" | "error";

const COPY_STATUS_RESET_MS = 2400;

const subscribeToNothing = () => () => {};
const getCanShare = () => typeof navigator.share === "function";
const getServerCanShare = () => false;

const isShareCancelled = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

export const useWebShare = () => {
  const canShare = useSyncExternalStore(
    subscribeToNothing,
    getCanShare,
    getServerCanShare,
  );
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timer = setTimeout(() => setCopyStatus("idle"), COPY_STATUS_RESET_MS);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  // A cancelled share sheet is the user's choice; any other failure falls back to copying the link.
  const shareContent = async (data: ShareData) => {
    try {
      await navigator.share(data);
    } catch (error) {
      if (isShareCancelled(error)) return;
      if (data.url) await copyText(data.url);
    }
  };

  return { canShare, copyStatus, copyText, shareContent };
};
