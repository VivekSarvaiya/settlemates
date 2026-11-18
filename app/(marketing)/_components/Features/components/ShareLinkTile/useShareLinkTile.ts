import { useId } from "react";
import { SPLIT_HASH_PARAM } from "@/components/shared/SplitCalculator/const";
import {
  buildSplitUrl,
  encodeSplit,
} from "@/components/shared/SplitCalculator/splitLink";
import { ROUTES } from "@/config/routes";
import { formatCents } from "@/lib/currency";
import { useWebShare } from "@/lib/hooks/useWebShare";
import { COPY_STATUS_MESSAGES, PREVIEW_PAYMENTS } from "./const";
import type { UseShareLinkTileParams } from "./types";

export const useShareLinkTile = ({ group }: UseShareLinkTileParams) => {
  const titleId = useId();
  const { copyStatus, copyText } = useWebShare();

  const { people, payments, totalCents } = group;
  const encoded = encodeSplit(people);
  const hashPrefix = `#${SPLIT_HASH_PARAM}=`;

  const handleCopy = () => copyText(buildSplitUrl(window.location.origin, people));

  return {
    titleId,
    path: ROUTES.splitBillCalculator,
    hashPrefix,
    encoded,
    href: `${ROUTES.splitBillCalculator}${hashPrefix}${encoded}`,
    previewRows: payments.slice(0, PREVIEW_PAYMENTS).map((payment) => ({
      key: payment.key,
      label: payment.label,
      amountLabel: formatCents(payment.amountCents),
    })),
    hiddenPaymentCount: Math.max(payments.length - PREVIEW_PAYMENTS, 0),
    preview: `Opens with ${people.length} people and ${formatCents(totalCents)} already filled in.`,
    isCopied: copyStatus === "copied",
    statusMessage: COPY_STATUS_MESSAGES[copyStatus],
    handleCopy,
  };
};
