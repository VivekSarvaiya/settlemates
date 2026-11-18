"use client";

import { ErrorState } from "./_components";
import type { ErrorPageProps } from "./_components/ErrorState/types";

export default function ErrorPage({ retry }: ErrorPageProps) {
  return <ErrorState onRetry={retry} />;
}
