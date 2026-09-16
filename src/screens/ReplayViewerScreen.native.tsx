// src/screens/ReplayViewerScreen.native.tsx

import {
  AlliveLoadingScreen,
} from "../components/loading/AlliveLoadingScreen";

import {
  ReplayViewerScreenBase,
} from "../components/live/replay/viewer/ReplayViewerScreenBase";

type ReplayViewerScreenProps = {
  requestedReplayId?: string | null;

  onClose?: () => void;

  onOpenUser?: (
    userId: string,
  ) => void;
};

export function ReplayViewerScreen({
  requestedReplayId = null,
  onClose,
  onOpenUser,
}: ReplayViewerScreenProps) {
  return (
    <ReplayViewerScreenBase
      requestedReplayId={
        requestedReplayId
      }
      onClose={
        onClose
      }
      onOpenUser={
        onOpenUser
      }
      renderLoading={() => (
        <AlliveLoadingScreen />
      )}
    />
  );
}