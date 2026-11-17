"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STAGE_COPY } from "../../const";
import type { CalculatorCardProps } from "../../types";
import { ResultView } from "../ResultView/ResultView";
import { SetupView } from "../SetupView/SetupView";

export function CalculatorCard({ calculator }: CalculatorCardProps) {
  const {
    stage,
    participants,
    paidCents,
    totalCents,
    balancesCents,
    copyStatus,
    canShare,
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
    handleNameFocus,
    handlePaidChange,
    handlePaidBlur,
    handleCopy,
    handleShare,
  } = calculator;

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
            balancesCents={balancesCents}
            equalShareCents={equalShareCents}
            notice={notice}
            canSubmit={canSubmit}
            firstPaymentRef={firstPaymentRef}
            onPeopleChange={handlePeopleChange}
            onNameChange={handleNameChange}
            onNameFocus={handleNameFocus}
            onPaidChange={handlePaidChange}
            onPaidBlur={handlePaidBlur}
            onSubmit={handleCalculate}
          />
        )}
        {stage === "result" && (
          <ResultView
            totalCents={totalCents}
            participants={participants}
            paidCents={paidCents}
            balancesCents={balancesCents}
            leftoverCents={leftoverCents}
            leftoverRecipientIndexes={leftoverRecipientIndexes}
            equalShareCents={equalShareCents}
            settlements={settlements}
            copyStatus={copyStatus}
            canShare={canShare}
            resultRef={resultRef}
            onEditSplit={handleEditSplit}
            onCopy={handleCopy}
            onShare={handleShare}
            onReset={handleReset}
          />
        )}
      </CardContent>
    </Card>
  );
}
