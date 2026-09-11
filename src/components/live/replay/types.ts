// src/components/live/replay/types.ts

import type {
  ActiveLive,
} from "../types";

export type Replay = ActiveLive & {
  endedAt: string;
  recordingUrl: string;
  replaySavedAt: string;
  replayVisibleUntil: string;
};
