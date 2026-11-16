"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResultView, SetupView } from "./components";
import { useSplitCalculator } from "./useSplitCalculator";

const STAGE_COPY = {
  setup: "Add who paid what. We'll split it equally and work out who pays whom.",
  result: "Everyone's share, worked out.",
} as const;

export function SplitCalculator() {
  const {
    stage,
    participants,
    paidCents,
    totalCents,
    sharesCents,
    copyStatus,
    notice,
    canSubmit,
    settlements,
    leftoverCents,
    leftoverRecipientIndexes,
    equalShareCents,
    minPeople,
    maxPeople,
    firstPaymentRef,
    resultRef,
    handlePeopleChange,
    handleCalculate,
    handleEditSplit,
    handleReset,
    handleNameChange,
    handlePaidChange,
    handleCopy,
  } = useSplitCalculator();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quick split</CardTitle>
        <CardDescription>{STAGE_COPY[stage]}</CardDescription>
      </CardHeader>
      <CardContent>
        {stage === "setup" && (
          <SetupView
            participants={participants}
            minPeople={minPeople}
            maxPeople={maxPeople}
            totalCents={totalCents}
            sharesCents={sharesCents}
            equalShareCents={equalShareCents}
            notice={notice}
            canSubmit={canSubmit}
            firstPaymentRef={firstPaymentRef}
            onPeopleChange={handlePeopleChange}
            onNameChange={handleNameChange}
            onPaidChange={handlePaidChange}
            onSubmit={handleCalculate}
          />
        )}
        {stage === "result" && (
          <ResultView
            totalCents={totalCents}
            participants={participants}
            paidCents={paidCents}
            sharesCents={sharesCents}
            leftoverCents={leftoverCents}
            leftoverRecipientIndexes={leftoverRecipientIndexes}
            equalShareCents={equalShareCents}
            settlements={settlements}
            copyStatus={copyStatus}
            resultRef={resultRef}
            onEditSplit={handleEditSplit}
            onCopy={handleCopy}
            onReset={handleReset}
          />
        )}
      </CardContent>
    </Card>
  );
}
