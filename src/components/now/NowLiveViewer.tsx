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
  onOpenUser?: (
    userId: string,
  ) => void;
};

export function NowLiveViewer({
  requestedLiveId = null,
  selectedLiveId = null,
  onOpenUser,
}: NowLiveViewerProps) {
  return (
    <LiveViewerScreen
      requestedLiveId={
        requestedLiveId ??
        selectedLiveId
      }
      onOpenUser={
        onOpenUser
      }
    />
  );
}
