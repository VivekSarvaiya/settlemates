"use client";

import { Link2, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SharePostProps } from "./types";
import { useSharePost } from "./useSharePost";

export function SharePost({ title, url }: SharePostProps) {
  const { canShare, copyMessage, whatsappHref, handleShare, handleCopyLink } =
    useSharePost({ title, url });

  return (
    <section aria-label="Share this article" className="flex flex-col gap-3">
      <p className="text-base font-medium">Useful? Send it to your group.</p>
      <div className="flex flex-wrap items-center gap-3">
        {canShare && (
          <Button variant="outline" className="h-11 px-4" onClick={handleShare}>
            <Share2 aria-hidden="true" data-icon="inline-start" />
            Share
          </Button>
        )}
        <Button
          variant="outline"
          className="h-11 px-4"
          nativeButton={false}
          render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}
        >
          <MessageCircle aria-hidden="true" data-icon="inline-start" />
          WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </Button>
        <Button variant="outline" className="h-11 px-4" onClick={handleCopyLink}>
          <Link2 aria-hidden="true" data-icon="inline-start" />
          Copy link
        </Button>
      </div>
      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {copyMessage}
      </p>
    </section>
  );
}
