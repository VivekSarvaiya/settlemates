import type { DemoGroup } from "../BentoGrid/types";

export interface ChatTileProps {
  group: DemoGroup;
  siteOrigin: string;
}

export interface UseChatTileParams {
  group: DemoGroup;
  siteOrigin: string;
}

export interface ChatReply {
  author: string;
  text: string;
}
