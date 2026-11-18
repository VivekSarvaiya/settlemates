import { useId, useState } from "react";
import { DEFAULT_NAMES } from "@/components/shared/SplitCalculator/const";
import { isYou } from "@/components/shared/SplitCalculator/phrases";
import { summarizeEqualSplit } from "@/domains/expenses/split";
import { formatCents } from "@/lib/currency";
import {
  BILL_PRESETS_CENTS,
  DEFAULT_BILL_CENTS,
  PAISA_DEFAULT_PEOPLE,
  PAISA_MAX_PEOPLE,
  PAISA_MIN_PEOPLE,
} from "./const";
import type { BillOption, ShareRow } from "./types";

const nameList = new Intl.ListFormat("en-IN", { type: "conjunction" });

const nameAt = (index: number) => DEFAULT_NAMES[index] ?? `Person ${index + 1}`;

export const usePaisaTile = () => {
  const titleId = useId();
  const [billCents, setBillCents] = useState(DEFAULT_BILL_CENTS);
  const [peopleCount, setPeopleCount] = useState(PAISA_DEFAULT_PEOPLE);

  const { sharesCents, baseShareCents, remainderCents, remainderRecipientIndexes } =
    summarizeEqualSplit(billCents, peopleCount);
  const shareTotalCents = sharesCents.reduce((sum, cents) => sum + cents, 0);

  const billOptions: BillOption[] = BILL_PRESETS_CENTS.map((cents) => ({
    cents,
    label: formatCents(cents),
    isSelected: cents === billCents,
  }));

  const rows: ShareRow[] = sharesCents.map((cents, index) => ({
    name: nameAt(index),
    amountLabel: formatCents(cents),
    hasExtra: cents > baseShareCents,
  }));

  const recipients = nameList.format(
    remainderRecipientIndexes.map((index) =>
      isYou(nameAt(index)) ? "you" : nameAt(index),
    ),
  );
  let leftoverNote = `${formatCents(billCents)} splits evenly ${peopleCount} ways. Nothing left over.`;
  if (remainderCents === 1) {
    leftoverNote = `The extra ${formatCents(remainderCents)} goes to ${recipients}.`;
  } else if (remainderCents > 1) {
    leftoverNote = `The extra ${formatCents(remainderCents)} goes one paisa each to ${recipients}.`;
  }

  const handleBillSelect = (cents: number) => setBillCents(cents);
  const handleAddPerson = () =>
    setPeopleCount((count) => Math.min(count + 1, PAISA_MAX_PEOPLE));
  const handleRemovePerson = () =>
    setPeopleCount((count) => Math.max(count - 1, PAISA_MIN_PEOPLE));

  return {
    titleId,
    billOptions,
    peopleCount,
    minPeople: PAISA_MIN_PEOPLE,
    maxPeople: PAISA_MAX_PEOPLE,
    rows,
    totalLabel: formatCents(shareTotalCents),
    leftoverNote,
    handleBillSelect,
    handleAddPerson,
    handleRemovePerson,
  };
};
