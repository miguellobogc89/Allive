// src/components/now/NowLiveViewer.web.tsx

import type {
  ActiveLive,
} from "../live/types";

import {
  LiveViewerScreen,
} from "../../screens/LiveViewerScreen.web";

type NowLiveViewerProps = {
  requestedLiveId?: string | null;
  selectedLiveId?: string | null;
  lives: ActiveLive[];
  onOpenUser?: (
    userId: string,
  ) => void;
};

export function NowLiveViewer({
  requestedLiveId = null,
  selectedLiveId = null,
  lives,
  onOpenUser,
}: NowLiveViewerProps) {
  return (
    <LiveViewerScreen
      requestedLiveId={
        requestedLiveId ??
        selectedLiveId
      }
      initialLives={
        lives
      }
      onOpenUser={
        onOpenUser
      }
    />
  );
}
