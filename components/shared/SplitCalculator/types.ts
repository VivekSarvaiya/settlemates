import type { FormEvent, RefObject } from "react";
import type { SettlementTransaction } from "@/domains/settlement/settle";

export type CalculatorStage = "setup" | "result";

export type CopyStatus = "idle" | "copied" | "error";

export interface Participant {
  id: string;
  name: string;
  /** What this person paid, as typed. Blank means zero. */
  paidInput: string;
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
  sharesCents: number[];
  equalShareCents: number;
  notice: SetupNotice | null;
  canSubmit: boolean;
  firstPaymentRef: RefObject<HTMLInputElement | null>;
  onPeopleChange: (delta: number) => void;
  onNameChange: (id: string, name: string) => void;
  onPaidChange: (id: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface ResultViewProps {
  totalCents: number;
  participants: Participant[];
  paidCents: number[];
  sharesCents: number[];
  leftoverCents: number;
  leftoverRecipientIndexes: number[];
  equalShareCents: number;
  settlements: SettlementTransaction[];
  copyStatus: CopyStatus;
  resultRef: RefObject<HTMLDivElement | null>;
  onEditSplit: () => void;
  onCopy: () => void;
  onReset: () => void;
}

export interface SettlementListProps {
  participants: Participant[];
  transactions: SettlementTransaction[];
}

export interface ParticipantRowProps {
  participant: Participant;
  index: number;
  shareCents: number;
  areSharesVisible: boolean;
  paidInputRef?: RefObject<HTMLInputElement | null>;
  onNameChange: (id: string, name: string) => void;
  onPaidChange: (id: string, value: string) => void;
}
