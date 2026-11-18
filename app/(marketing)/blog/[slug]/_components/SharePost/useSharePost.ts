import { useWebShare } from "@/lib/hooks/useWebShare";
import { COPY_STATUS_MESSAGES } from "./const";
import type { SharePostProps } from "./types";

export const useSharePost = ({ title, url }: SharePostProps) => {
  const { canShare, copyStatus, copyText, shareContent } = useWebShare();

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const handleShare = () => shareContent({ title, url });
  const handleCopyLink = () => copyText(url);

  return {
    canShare,
    copyMessage: COPY_STATUS_MESSAGES[copyStatus],
    whatsappHref,
    handleShare,
    handleCopyLink,
  };
};
