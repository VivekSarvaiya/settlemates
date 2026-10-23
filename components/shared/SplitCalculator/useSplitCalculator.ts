import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  computeSplit,
  parsePercentInput,
  splitEqually,
  type SplitAllocation,
  type SplitMode,
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

function toAllocation(value: string, mode: SplitMode): SplitAllocation {
  if (mode === "percentage") {
    return { mode, percent: parsePercentInput(value) ?? Number.NaN };
  }
  if (mode === "exact") {
    return { mode, cents: parseAmountToCents(value) ?? Number.NaN };
  }
  return { mode };
}

export const useSplitCalculator = () => {
  const [stage, setStage] = useState<CalculatorStage>("entry");
  const [amountInput, setAmountInput] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [peopleCount, setPeopleCount] = useState(DEFAULT_PEOPLE_COUNT);
  const [totalCents, setTotalCents] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [splitMode, setSplitMode] = useState<SplitMode>("equal");
  const [isCustomized, setIsCustomized] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  const amountInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const customizeRef = useRef<HTMLDivElement>(null);
  const pendingAmountFocusRef = useRef(false);

  const allocations = useMemo(
    () => participants.map((participant) => toAllocation(participant.value, splitMode)),
    [participants, splitMode],
  );
  const splitResult = useMemo(
    () => computeSplit(totalCents, allocations),
    [totalCents, allocations],
  );
  const sharesCents = useMemo(
    () =>
      isCustomized
        ? splitResult.sharesCents
        : splitEqually(totalCents, participants.length),
    [isCustomized, splitResult.sharesCents, totalCents, participants.length],
  );

  const status: AllocationStatus = useMemo(() => {
    if (splitResult.isValid) {
      return {
        tone: "valid",
        text: `Adds up to ${formatCents(totalCents)} exactly`,
      };
    }
    if (splitResult.remainderCents > 0) {
      return {
        tone: "invalid",
        text: `${formatCents(splitResult.remainderCents)} still to assign`,
      };
    }
    if (splitResult.remainderCents < 0) {
      return {
        tone: "invalid",
        text: `${formatCents(-splitResult.remainderCents)} over the total`,
      };
    }
    const hasEmptyShare = participants.some(
      (participant) => participant.value.trim() === "",
    );
    return {
      tone: "invalid",
      text: hasEmptyShare ? "Enter a share for everyone" : "Fix the highlighted shares",
    };
  }, [splitResult, totalCents, participants]);

  const hasPeople = participants.length > 0;
  const leftoverCents =
    !isCustomized && hasPeople ? totalCents % participants.length : 0;
  const equalShareCents = hasPeople
    ? Math.floor(totalCents / participants.length)
    : 0;
  const equalSharePercent = hasPeople
    ? Math.round(1000 / participants.length) / 10
    : 0;

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
    if (!splitResult.isValid) return;
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
  const handleModeChange = (mode: SplitMode) => {
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
    draftSharesCents: splitResult.sharesCents,
    splitMode,
    isCustomized,
    copyStatus,
    status,
    isValid: splitResult.isValid,
    leftoverCents,
    equalShareCents,
    equalSharePercent,
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
