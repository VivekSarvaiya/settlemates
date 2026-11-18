"use client";

import { Reveal } from "@/components/ui/reveal";
import { ChatTile } from "../ChatTile/ChatTile";
import { PaisaTile } from "../PaisaTile/PaisaTile";
import { SettlementTile } from "../SettlementTile/SettlementTile";
import { ShareLinkTile } from "../ShareLinkTile/ShareLinkTile";
import type { BentoGridProps } from "./types";
import { useBentoGrid } from "./useBentoGrid";

export function BentoGrid({ siteOrigin }: BentoGridProps) {
  const {
    group,
    siteHost,
    peopleCount,
    minPeople,
    maxPeople,
    handleAddPerson,
    handleRemovePerson,
    handleShuffle,
  } = useBentoGrid({ siteOrigin });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
      <Reveal className="md:col-span-2 lg:col-span-4 lg:row-span-2">
        <SettlementTile
          group={group}
          peopleCount={peopleCount}
          minPeople={minPeople}
          maxPeople={maxPeople}
          onAddPerson={handleAddPerson}
          onRemovePerson={handleRemovePerson}
          onShuffle={handleShuffle}
        />
      </Reveal>
      <Reveal delay={0.06} className="lg:col-span-2 lg:row-span-2">
        <PaisaTile />
      </Reveal>
      <Reveal delay={0.06} className="lg:col-span-3">
        <ShareLinkTile group={group} siteHost={siteHost} />
      </Reveal>
      <Reveal delay={0.12} className="md:col-span-2 lg:col-span-3">
        <ChatTile group={group} siteOrigin={siteOrigin} />
      </Reveal>
    </div>
  );
}
