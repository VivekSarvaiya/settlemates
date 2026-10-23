"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomizeView, EntryView, ResultView } from "./components";
import { useSplitCalculator } from "./useSplitCalculator";

const STAGE_COPY = {
  entry: "Split a bill in seconds — no sign-up needed.",
  result: "Everyone's share, worked out.",
  customize: "Pick one way to split, then set each person's share.",
} as const;

export function SplitCalculator() {
  const {
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
    isValid,
    leftoverCents,
    equalShareCents,
    equalSharePercent,
    minPeople,
    maxPeople,
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
  } = useSplitCalculator();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quick split</CardTitle>
        <CardDescription>{STAGE_COPY[stage]}</CardDescription>
      </CardHeader>
      <CardContent>
        {stage === "entry" && (
          <EntryView
            amountInput={amountInput}
            amountError={amountError}
            peopleCount={peopleCount}
            minPeople={minPeople}
            maxPeople={maxPeople}
            amountInputRef={amountInputRef}
            onAmountChange={handleAmountChange}
            onPeopleChange={handlePeopleChange}
            onSubmit={handleCalculate}
          />
        )}
        {stage === "result" && (
          <ResultView
            totalCents={totalCents}
            peopleCount={peopleCount}
            participants={participants}
            sharesCents={sharesCents}
            isCustomized={isCustomized}
            status={status}
            copyStatus={copyStatus}
            leftoverCents={leftoverCents}
            equalShareCents={equalShareCents}
            resultRef={resultRef}
            onCustomize={handleCustomize}
            onCopy={handleCopy}
            onReset={handleReset}
          />
        )}
        {stage === "customize" && (
          <CustomizeView
            totalCents={totalCents}
            participants={participants}
            sharesCents={draftSharesCents}
            splitMode={splitMode}
            status={status}
            isValid={isValid}
            equalShareCents={equalShareCents}
            equalSharePercent={equalSharePercent}
            customizeRef={customizeRef}
            onNameChange={handleNameChange}
            onModeChange={handleModeChange}
            onValueChange={handleValueChange}
            onApply={handleApply}
            onBack={handleBack}
          />
        )}
      </CardContent>
    </Card>
  );
}
