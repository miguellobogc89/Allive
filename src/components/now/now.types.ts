// src/components/now/now.types.ts

import type {
  ReplayItem,
} from "../../api/replayApi";

import type {
  ActiveLive,
} from "../live/types";

export type NowSection =
  | "now"
  | "map"
  | "following";

export type NowGridItem =
  | {
      type: "live";
      live: ActiveLive;
    }
  | {
      type: "replay";
      replay: ReplayItem;
    };