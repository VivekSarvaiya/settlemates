import type { FormEvent, RefObject } from "react";
import type { SplitMode } from "@/domains/expenses/split";

export type CalculatorStage = "entry" | "result" | "customize";

/** The Quick Split UI exposes three modes; "shares" is domain/API-only. */
export type CalculatorSplitMode = Exclude<SplitMode, "shares">;

export type CopyStatus = "idle" | "copied" | "error";

export interface Participant {
  id: string;
  name: string;
  value: string;
}

export interface AllocationStatus {
  tone: "valid" | "invalid";
  text: string;
}

export interface EntryFormProps {
  amountInput: string;
  amountError: string | null;
  peopleCount: number;
  minPeople: number;
  maxPeople: number;
  amountInputRef: RefObject<HTMLInputElement | null>;
  onAmountChange: (value: string) => void;
  onPeopleChange: (delta: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface ResultViewProps {
  totalCents: number;
  peopleCount: number;
  participants: Participant[];
  sharesCents: number[];
  isCustomized: boolean;
  status: AllocationStatus;
  copyStatus: CopyStatus;
  leftoverCents: number;
  leftoverRecipientIndexes: number[];
  equalShareCents: number;
  resultRef: RefObject<HTMLDivElement | null>;
  onCustomize: () => void;
  onCopy: () => void;
  onReset: () => void;
}

export interface CustomizeViewProps {
  totalCents: number;
  participants: Participant[];
  sharesCents: number[];
  splitMode: CalculatorSplitMode;
  status: AllocationStatus;
  isValid: boolean;
  equalShareCents: number;
  equalSharePercent: number;
  customizeRef: RefObject<HTMLDivElement | null>;
  onNameChange: (id: string, name: string) => void;
  onModeChange: (mode: CalculatorSplitMode) => void;
  onValueChange: (id: string, value: string) => void;
  onApply: () => void;
  onBack: () => void;
}

export interface ParticipantRowProps {
  participant: Participant;
  index: number;
  shareCents: number;
  splitMode: CalculatorSplitMode;
  equalShareCents: number;
  equalSharePercent: number;
  onNameChange: (id: string, name: string) => void;
  onValueChange: (id: string, value: string) => void;
}

export interface SplitModeOption {
  value: CalculatorSplitMode;
  label: string;
  description: string;
}
