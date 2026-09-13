import type {
  ReactNode,
} from "react";

import type {
  Replay,
} from "../types";

export type ReplayPlaybackControls = {
  paused: boolean;
  muted: boolean;
  currentTime: number;
  duration: number;
  togglePlayback: () => void;
  seekTo: (time: number) => void;
  skipBackward: () => void;
  skipForward: () => void;
  toggleMute: () => void;
};

export type ReplayVideoPlayerProps = {
  replay: Replay;
  children: (
    playback:
      ReplayPlaybackControls,
  ) => ReactNode;
};
