import { useState } from "react";
import {
  DEMO_DEFAULT_PEOPLE,
  DEMO_MAX_PEOPLE,
  DEMO_MIN_PEOPLE,
  DEMO_START_PAID_CENTS,
} from "./const";
import type { UseBentoGridParams } from "./types";
import { buildDemoGroup, shufflePaidCents } from "./utils";

export const useBentoGrid = ({ siteOrigin }: UseBentoGridParams) => {
  const [peopleCount, setPeopleCount] = useState(DEMO_DEFAULT_PEOPLE);
  const [paidCents, setPaidCents] = useState(DEMO_START_PAID_CENTS);

  const group = buildDemoGroup(paidCents.slice(0, peopleCount));

  const handleAddPerson = () =>
    setPeopleCount((count) => Math.min(count + 1, DEMO_MAX_PEOPLE));
  const handleRemovePerson = () =>
    setPeopleCount((count) => Math.max(count - 1, DEMO_MIN_PEOPLE));
  const handleShuffle = () => setPaidCents(shufflePaidCents(DEMO_MAX_PEOPLE));

  return {
    group,
    siteHost: new URL(siteOrigin).host,
    peopleCount,
    minPeople: DEMO_MIN_PEOPLE,
    maxPeople: DEMO_MAX_PEOPLE,
    handleAddPerson,
    handleRemovePerson,
    handleShuffle,
  };
};
