// src/components/now/NowReplayViewer.tsx

import {
  ReplayViewerScreen,
} from "../../screens/ReplayViewerScreen.native";

type NowReplayViewerProps = {
  requestedReplayId?: string | null;
  selectedReplayId?: string | null;
  onOpenUser?: (
    userId: string,
  ) => void;
};

export function NowReplayViewer({
  requestedReplayId = null,
  selectedReplayId = null,
  onOpenUser,
}: NowReplayViewerProps) {
  return (
    <ReplayViewerScreen
      requestedReplayId={
        requestedReplayId ??
        selectedReplayId
      }
      onOpenUser={
        onOpenUser
      }
    />
  );
}
