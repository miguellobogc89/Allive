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

  onClose?: () => void;

  onOpenUser?: (
    userId: string,
  ) => void;
};

export function NowLiveViewer({
  requestedLiveId = null,
  selectedLiveId = null,
  lives,
  onClose,
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
      onClose={
        onClose
      }
      onOpenUser={
        onOpenUser
      }
    />
  );
}