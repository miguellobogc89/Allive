// src/components/now/NowReplayViewer.web.tsx

import {
  ReplayViewerScreen,
} from "../../screens/ReplayViewerScreen.web";

type NowReplayViewerProps = {
  requestedReplayId?: string | null;
  selectedReplayId?: string | null;

  onClose?: () => void;

  onOpenUser?: (
    userId: string,
  ) => void;
};

export function NowReplayViewer({
  requestedReplayId = null,
  selectedReplayId = null,
  onClose,
  onOpenUser,
}: NowReplayViewerProps) {
  return (
    <ReplayViewerScreen
      requestedReplayId={
        requestedReplayId ??
        selectedReplayId
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