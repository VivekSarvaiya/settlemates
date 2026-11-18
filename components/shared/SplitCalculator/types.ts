import type { FocusEvent, FormEvent, RefObject } from "react";
import type { SettlementTransaction } from "@/domains/settlement/settle";
import type { useSplitCalculator } from "./useSplitCalculator";

export type CalculatorStage = "setup" | "result";

export type CopyStatus = "idle" | "copied" | "error";

export interface Participant {
  id: string;
  name: string;
  /** What this person paid, as typed. Blank means zero. */
  paidInput: string;
}

export interface SharedPerson {
  name: string;
  paidCents: number;
}

export interface BalanceLabel {
  tone: "credit" | "debit" | "square";
  text: string;
}

export interface SetupNotice {
  tone: "hint" | "error";
  text: string;
}

export interface SetupViewProps {
  participants: Participant[];
  minPeople: number;
  maxPeople: number;
  totalCents: number;
  balancesCents: number[];
  equalShareCents: number;
  notice: SetupNotice | null;
  canSubmit: boolean;
  firstPaymentRef: RefObject<HTMLInputElement | null>;
  onPeopleChange: (delta: number) => void;
  onNameChange: (id: string, name: string) => void;
  onNameFocus: (event: FocusEvent<HTMLInputElement>) => void;
  onPaidChange: (id: string, value: string) => void;
  onPaidBlur: (id: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface ResultViewProps {
  totalCents: number;
  participants: Participant[];
  paidCents: number[];
  balancesCents: number[];
  leftoverCents: number;
  leftoverRecipientIndexes: number[];
  equalShareCents: number;
  settlements: SettlementTransaction[];
  copyStatus: CopyStatus;
  canShare: boolean;
  resultRef: RefObject<HTMLDivElement | null>;
  onEditSplit: () => void;
  onCopy: () => void;
  onShare: () => void;
  onReset: () => void;
}

export interface SettlementListProps {
  participants: Participant[];
  transactions: SettlementTransaction[];
}

export interface ParticipantRowProps {
  participant: Participant;
  index: number;
  balanceCents: number;
  isBalanceVisible: boolean;
  paidInputRef?: RefObject<HTMLInputElement | null>;
  onNameChange: (id: string, name: string) => void;
  onNameFocus: (event: FocusEvent<HTMLInputElement>) => void;
  onPaidChange: (id: string, value: string) => void;
  onPaidBlur: (id: string) => void;
}

export type SplitCalculatorState = ReturnType<typeof useSplitCalculator>;

export interface CalculatorCardProps {
  calculator: SplitCalculatorState;
}

export interface ShareMessageInput {
  names: string[];
  paidCents: number[];
  balancesCents: number[];
  transactions: SettlementTransaction[];
  totalCents: number;
  shareCents: number;
  link: string;
}
