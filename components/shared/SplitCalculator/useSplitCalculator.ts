import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  computeSplit,
  parsePercentInput,
  summarizeEqualSplit,
  type SplitInput,
  type SplitResult,
} from "@/domains/expenses/split";
import { formatCents, parseAmountToCents } from "@/lib/currency";
import {
  DEFAULT_NAMES,
  DEFAULT_PEOPLE_COUNT,
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
} from "./const";
import type {
  AllocationStatus,
  CalculatorSplitMode,
  CalculatorStage,
  CopyStatus,
  Participant,
} from "./types";

function createParticipants(count: number): Participant[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `person-${index + 1}`,
    name: DEFAULT_NAMES[index] ?? `Friend ${index + 1}`,
    value: "",
  }));
}

function buildSplitInput(
  mode: CalculatorSplitMode,
  totalCents: number,
  participants: Participant[],
): SplitInput {
  if (mode === "percentage") {
    return {
      mode,
      totalCents,
      percentages: participants.map((participant) =>
        parsePercentInput(participant.value),
      ),
    };
  }
  if (mode === "exact") {
    return {
      mode,
      totalCents,
      amountsCents: participants.map((participant) =>
        parseAmountToCents(participant.value),
      ),
    };
  }
  return { mode, totalCents, participantCount: participants.length };
}

function describeStatus(
  result: SplitResult,
  totalCents: number,
  participants: Participant[],
): AllocationStatus {
  if (result.ok) {
    return { tone: "valid", text: `Adds up to ${formatCents(totalCents)} exactly` };
  }

  const { error } = result;

  if (error.code === "amount-mismatch" || error.code === "percentage-mismatch") {
    if (error.differenceCents !== undefined && error.differenceCents !== 0) {
      const difference = formatCents(Math.abs(error.differenceCents));
      return {
        tone: "invalid",
        text:
          error.differenceCents > 0
            ? `${difference} still to assign`
            : `${difference} over the total`,
      };
    }
    return {
      tone: "invalid",
      text:
        error.code === "percentage-mismatch"
          ? "Percentages must add up to 100%"
          : "Fix the highlighted shares",
    };
  }

  if (
    error.code === "invalid-amount" ||
    error.code === "invalid-percentage" ||
    error.code === "invalid-share" ||
    error.code === "no-shares"
  ) {
    const hasEmptyShare = participants.some(
      (participant) => participant.value.trim() === "",
    );
    return {
      tone: "invalid",
      text: hasEmptyShare
        ? "Enter a share for everyone"
        : "Fix the highlighted shares",
    };
  }

  return { tone: "invalid", text: "Fix the highlighted shares" };
}

export const useSplitCalculator = () => {
  const [stage, setStage] = useState<CalculatorStage>("entry");
  const [amountInput, setAmountInput] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [peopleCount, setPeopleCount] = useState(DEFAULT_PEOPLE_COUNT);
  const [totalCents, setTotalCents] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [splitMode, setSplitMode] = useState<CalculatorSplitMode>("equal");
  const [isCustomized, setIsCustomized] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  const amountInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const customizeRef = useRef<HTMLDivElement>(null);
  const pendingAmountFocusRef = useRef(false);

  const splitInput = useMemo(
    () => buildSplitInput(splitMode, totalCents, participants),
    [splitMode, totalCents, participants],
  );
  const splitResult = useMemo(() => computeSplit(splitInput), [splitInput]);

  const equalSummary = useMemo(
    () => summarizeEqualSplit(totalCents, participants.length),
    [totalCents, participants.length],
  );

  const draftSharesCents = splitResult.ok
    ? splitResult.sharesCents
    : splitResult.previewSharesCents;
  const sharesCents = isCustomized
    ? draftSharesCents
    : equalSummary.sharesCents;

  const status = useMemo(
    () => describeStatus(splitResult, totalCents, participants),
    [splitResult, totalCents, participants],
  );

  const summaryText = useMemo(() => {
    const rows = participants.map((participant, index) => {
      const name = participant.name.trim() || `Person ${index + 1}`;
      return `${name} · ${formatCents(sharesCents[index] ?? 0)}`;
    });
    return [`Split of ${formatCents(totalCents)}`, ...rows].join("\n");
  }, [participants, sharesCents, totalCents]);

  useEffect(() => {
    if (stage === "result") {
      resultRef.current?.focus();
    } else if (stage === "customize") {
      customizeRef.current?.focus();
    } else if (pendingAmountFocusRef.current) {
      pendingAmountFocusRef.current = false;
      amountInputRef.current?.focus();
    }
  }, [stage]);

  useEffect(() => {
    if (copyStatus === "idle") return;

    const timer = setTimeout(() => setCopyStatus("idle"), 2400);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  const handleAmountChange = (value: string) => {
    setAmountInput(value);
    if (amountError) setAmountError(null);
  };

  const handlePeopleChange = (delta: number) => {
    setPeopleCount((count) =>
      Math.min(MAX_PARTICIPANTS, Math.max(MIN_PARTICIPANTS, count + delta)),
    );
  };

  const handleCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cents = parseAmountToCents(amountInput);
    if (cents === null || cents <= 0) {
      setAmountError("Enter an amount greater than 0.");
      amountInputRef.current?.focus();
      return;
    }

    setAmountError(null);
    setTotalCents(cents);
    setParticipants(createParticipants(peopleCount));
    setSplitMode("equal");
    setIsCustomized(false);
    setCopyStatus("idle");
    setStage("result");
  };

  const handleCustomize = () => setStage("customize");
  const handleBack = () => setStage("result");

  const handleApply = () => {
    if (!splitResult.ok) return;
    setIsCustomized(true);
    setStage("result");
  };

  const handleReset = () => {
    pendingAmountFocusRef.current = true;
    setStage("entry");
    setAmountInput("");
    setAmountError(null);
    setTotalCents(0);
    setParticipants([]);
    setSplitMode("equal");
    setIsCustomized(false);
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

  // Values mean different things per mode (percent vs rupees), so switching clears them.
  const handleModeChange = (mode: CalculatorSplitMode) => {
    if (mode === splitMode) return;
    setSplitMode(mode);
    setParticipants((current) =>
      current.map((participant) => ({ ...participant, value: "" })),
    );
  };

  const handleValueChange = (id: string, value: string) =>
    updateParticipant(id, (participant) => ({ ...participant, value }));

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
    amountInput,
    amountError,
    peopleCount,
    totalCents,
    participants,
    sharesCents,
    draftSharesCents,
    splitMode,
    isCustomized,
    copyStatus,
    status,
    isValid: splitResult.ok,
    leftoverCents: equalSummary.remainderCents,
    leftoverRecipientIndexes: equalSummary.remainderRecipientIndexes,
    equalShareCents: equalSummary.baseShareCents,
    equalSharePercent: equalSummary.baseSharePercent,
    minPeople: MIN_PARTICIPANTS,
    maxPeople: MAX_PARTICIPANTS,
    amountInputRef,
    resultRef,
    customizeRef,
    handleAmountChange,
    handlePeopleChange,
    handleCalculate,
    handleCustomize,
    handleBack,
    handleApply,
    handleReset,
    handleNameChange,
    handleModeChange,
    handleValueChange,
    handleCopy,
  };
};
