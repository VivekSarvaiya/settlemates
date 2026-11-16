import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { summarizeEqualSplit } from "@/domains/expenses/split";
import {
  computeSettlement,
  type SettlementTransaction,
} from "@/domains/settlement/settle";
import { formatCents, parseAmountToCents } from "@/lib/currency";
import {
  DEFAULT_NAMES,
  DEFAULT_PEOPLE_COUNT,
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
} from "./const";
import { displayName } from "./displayName";
import type {
  CalculatorStage,
  CopyStatus,
  Participant,
  SetupNotice,
} from "./types";

interface ContributionSummary {
  /** Blank rows are valid zero contributions. Invalid rows are reported separately. */
  paidCents: number[];
  paidTotalCents: bigint;
  hasInvalidValue: boolean;
  isTotalTooLarge: boolean;
}

function createParticipants(count: number): Participant[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `person-${index + 1}`,
    name: DEFAULT_NAMES[index] ?? `Friend ${index + 1}`,
    paidInput: "",
  }));
}

function summarizeContributions(
  participants: Participant[],
): ContributionSummary {
  const paidCents: number[] = [];
  let paidTotalCents = BigInt(0);
  let hasInvalidValue = false;

  for (const participant of participants) {
    const input = participant.paidInput.trim();
    const cents = input === "" ? 0 : parseAmountToCents(input);

    if (cents === null || !Number.isSafeInteger(cents)) {
      hasInvalidValue = true;
      paidCents.push(0);
      continue;
    }

    paidCents.push(cents);
    paidTotalCents += BigInt(cents);
  }

  return {
    paidCents,
    paidTotalCents,
    hasInvalidValue,
    isTotalTooLarge: paidTotalCents > BigInt(Number.MAX_SAFE_INTEGER),
  };
}

export const useSplitCalculator = () => {
  const [stage, setStage] = useState<CalculatorStage>("setup");
  const [participants, setParticipants] = useState<Participant[]>(() =>
    createParticipants(DEFAULT_PEOPLE_COUNT),
  );
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  const resultRef = useRef<HTMLDivElement>(null);
  const firstPaymentRef = useRef<HTMLInputElement>(null);
  const pendingSetupFocusRef = useRef(false);

  const contributionSummary = useMemo(
    () => summarizeContributions(participants),
    [participants],
  );

  // The bill total is simply what the group paid. No separate amount to reconcile.
  const totalCents = contributionSummary.isTotalTooLarge
    ? 0
    : Number(contributionSummary.paidTotalCents);

  const equalSummary = useMemo(
    () => summarizeEqualSplit(totalCents, participants.length),
    [totalCents, participants.length],
  );
  const sharesCents = equalSummary.sharesCents;

  const isValid =
    !contributionSummary.hasInvalidValue &&
    !contributionSummary.isTotalTooLarge &&
    totalCents > 0;

  const settlements = useMemo<SettlementTransaction[]>(() => {
    if (!isValid) return [];

    const result = computeSettlement(
      contributionSummary.paidCents,
      sharesCents,
    );
    return result.ok ? result.transactions : [];
  }, [isValid, contributionSummary, sharesCents]);

  const notice = useMemo<SetupNotice | null>(() => {
    if (contributionSummary.hasInvalidValue) {
      return {
        tone: "error",
        text: "Fix the highlighted payments to continue.",
      };
    }
    if (contributionSummary.isTotalTooLarge) {
      return { tone: "error", text: "These amounts are too large." };
    }
    if (totalCents === 0) {
      return {
        tone: "hint",
        text: "Enter what each person paid to get started.",
      };
    }
    return null;
  }, [
    contributionSummary.hasInvalidValue,
    contributionSummary.isTotalTooLarge,
    totalCents,
  ]);

  const summaryText = useMemo(() => {
    const rows = participants.map((participant, index) => {
      const name = displayName(participant.name, index);
      const paid = contributionSummary.paidCents[index] ?? 0;
      return `${name} paid ${formatCents(paid)} · share ${formatCents(sharesCents[index] ?? 0)}`;
    });

    const lines = [
      `${formatCents(totalCents)} split between ${participants.length} ${
        participants.length === 1 ? "person" : "people"
      }`,
      `Each pays ${formatCents(equalSummary.baseShareCents)}`,
      "",
      ...rows,
    ];

    if (settlements.length > 0) {
      lines.push("", "Who pays whom");
      for (const transaction of settlements) {
        const from = displayName(
          participants[transaction.fromIndex]?.name ?? "",
          transaction.fromIndex,
        );
        const to = displayName(
          participants[transaction.toIndex]?.name ?? "",
          transaction.toIndex,
        );
        lines.push(`${from} pays ${to} ${formatCents(transaction.amountCents)}`);
      }
    } else {
      lines.push("", "Everyone's square — no payments needed.");
    }

    return lines.join("\n");
  }, [
    participants,
    contributionSummary,
    sharesCents,
    settlements,
    totalCents,
    equalSummary.baseShareCents,
  ]);

  useEffect(() => {
    if (stage === "result") {
      resultRef.current?.focus();
    } else if (pendingSetupFocusRef.current) {
      pendingSetupFocusRef.current = false;
      firstPaymentRef.current?.focus();
    }
  }, [stage]);

  useEffect(() => {
    if (copyStatus === "idle") return;

    const timer = setTimeout(() => setCopyStatus("idle"), 2400);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  const handlePeopleChange = (delta: number) => {
    setParticipants((current) => {
      const nextCount = Math.min(
        MAX_PARTICIPANTS,
        Math.max(MIN_PARTICIPANTS, current.length + delta),
      );
      if (nextCount === current.length) return current;
      if (nextCount < current.length) return current.slice(0, nextCount);

      return [
        ...current,
        ...createParticipants(nextCount).slice(current.length),
      ];
    });
  };

  const handleCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    setCopyStatus("idle");
    setStage("result");
  };

  const handleEditSplit = () => {
    pendingSetupFocusRef.current = true;
    setStage("setup");
  };

  const handleReset = () => {
    pendingSetupFocusRef.current = true;
    setStage("setup");
    setParticipants(createParticipants(DEFAULT_PEOPLE_COUNT));
    setCopyStatus("idle");
  };

  const updateParticipant = (
    id: string,
    update: (participant: Participant) => Participant,
  ) => {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === id ? update(participant) : participant,
      ),
    );
  };

  const handleNameChange = (id: string, name: string) =>
    updateParticipant(id, (participant) => ({ ...participant, name }));

  const handlePaidChange = (id: string, paidInput: string) =>
    updateParticipant(id, (participant) => ({ ...participant, paidInput }));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  return {
    stage,
    participants,
    paidCents: contributionSummary.paidCents,
    totalCents,
    sharesCents,
    copyStatus,
    notice,
    canSubmit: isValid,
    settlements,
    leftoverCents: equalSummary.remainderCents,
    leftoverRecipientIndexes: equalSummary.remainderRecipientIndexes,
    equalShareCents: equalSummary.baseShareCents,
    minPeople: MIN_PARTICIPANTS,
    maxPeople: MAX_PARTICIPANTS,
    firstPaymentRef,
    resultRef,
    handlePeopleChange,
    handleCalculate,
    handleEditSplit,
    handleReset,
    handleNameChange,
    handlePaidChange,
    handleCopy,
  };
};
