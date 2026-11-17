import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { FocusEvent, FormEvent } from "react";
import { summarizeEqualSplit } from "@/domains/expenses/split";
import {
  computeSettlement,
  type SettlementTransaction,
} from "@/domains/settlement/settle";
import {
  formatAmountInput,
  formatCents,
  parseAmountToCents,
} from "@/lib/currency";
import {
  DEFAULT_NAMES,
  DEFAULT_PEOPLE_COUNT,
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
} from "./const";
import { displayName } from "./displayName";
import { describeBalance, describePayment } from "./phrases";
import { buildSplitUrl, decodeSplitHash } from "./splitLink";
import type {
  CalculatorStage,
  CopyStatus,
  Participant,
  SetupNotice,
  SharedPerson,
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

function participantsFromShared(people: SharedPerson[]): Participant[] {
  return people.map((person, index) => ({
    id: `person-${index + 1}`,
    name: person.name,
    paidInput: person.paidCents > 0 ? formatAmountInput(person.paidCents) : "",
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

const subscribeToNothing = () => () => {};
const getCanShare = () => typeof navigator.share === "function";
const getServerCanShare = () => false;

const isShareCancelled = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

export const useSplitCalculator = () => {
  const [stage, setStage] = useState<CalculatorStage>("setup");
  const [participants, setParticipants] = useState<Participant[]>(() =>
    createParticipants(DEFAULT_PEOPLE_COUNT),
  );
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const canShare = useSyncExternalStore(
    subscribeToNothing,
    getCanShare,
    getServerCanShare,
  );

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

  const balancesCents = contributionSummary.paidCents.map(
    (paid, index) => paid - (sharesCents[index] ?? 0),
  );

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

  // Opening a shared link restores that split once, then clears the fragment so edits aren't undone on refresh.
  useEffect(() => {
    const shared = decodeSplitHash(window.location.hash);
    if (!shared) return;

    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    /* eslint-disable react-hooks/set-state-in-effect -- the URL fragment only exists in the browser, after hydration */
    setParticipants(participantsFromShared(shared));
    setStage("result");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

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

  const buildShareText = () => {
    const nameAt = (index: number) =>
      displayName(participants[index]?.name ?? "", index);
    const rows = participants.map((_, index) => {
      const paid = contributionSummary.paidCents[index] ?? 0;
      return `${nameAt(index)} paid ${formatCents(paid)} · ${describeBalance(balancesCents[index] ?? 0).text}`;
    });
    const payments =
      settlements.length > 0
        ? [
            "Who pays whom",
            ...settlements.map(
              (transaction) =>
                `${describePayment(nameAt(transaction.fromIndex), nameAt(transaction.toIndex))} ${formatCents(transaction.amountCents)}`,
            ),
          ]
        : ["Everyone's square — no payments needed."];
    const link = buildSplitUrl(
      window.location.origin,
      participants.map((participant, index) => ({
        name: participant.name,
        paidCents: contributionSummary.paidCents[index] ?? 0,
      })),
    );

    return [
      `${formatCents(totalCents)} split between ${participants.length} ${
        participants.length === 1 ? "person" : "people"
      }`,
      `Each person's share: ${formatCents(equalSummary.baseShareCents)}`,
      "",
      ...rows,
      "",
      ...payments,
      "",
      `Open this split on SettleMates: ${link}`,
    ].join("\n");
  };

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

  const handleNameFocus = (event: FocusEvent<HTMLInputElement>) =>
    event.currentTarget.select();

  const handlePaidChange = (id: string, paidInput: string) =>
    updateParticipant(id, (participant) => ({ ...participant, paidInput }));

  const handlePaidBlur = (id: string) =>
    updateParticipant(id, (participant) => {
      const input = participant.paidInput.trim();
      const cents = input === "" ? null : parseAmountToCents(input);
      if (cents === null || !Number.isSafeInteger(cents)) return participant;

      return { ...participant, paidInput: formatAmountInput(cents) };
    });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText());
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  const handleShare = async () => {
    const text = buildShareText();
    try {
      await navigator.share({ text });
    } catch (error) {
      if (isShareCancelled(error)) return;
      await handleCopy();
    }
  };

  return {
    stage,
    participants,
    paidCents: contributionSummary.paidCents,
    totalCents,
    sharesCents,
    balancesCents,
    copyStatus,
    canShare,
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
    handleNameFocus,
    handlePaidChange,
    handlePaidBlur,
    handleCopy,
    handleShare,
  };
};
