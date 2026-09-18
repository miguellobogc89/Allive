// src/components/now/NowLiveViewer.tsx

import type {
  ActiveLive,
} from "../live/types";

import {
  LiveViewerScreen,
} from "../../screens/LiveViewerScreen.native";

type NowLiveViewerProps = {
  requestedLiveId?: string | null;
  selectedLiveId?: string | null;

  lives: ActiveLive[];

  onClose?: () => void;

  onOpenUser?: (
    userId: string,
  ) => void;

  onLiveEnded?: (
    endedLiveId: string,
  ) => void;

  onNoLivesAvailable?:
    () => void;
};

export function NowLiveViewer({
  requestedLiveId = null,
  selectedLiveId = null,
  onClose,
  onOpenUser,
  onLiveEnded,
  onNoLivesAvailable,
}: NowLiveViewerProps) {
  return (
    <LiveViewerScreen
      requestedLiveId={
        requestedLiveId ??
        selectedLiveId
      }
      onClose={
        onClose
      }
      onOpenUser={
        onOpenUser
      }
      onLiveEnded={
        onLiveEnded
      }
      onNoLivesAvailable={
        onNoLivesAvailable
      }
    />
  );
}