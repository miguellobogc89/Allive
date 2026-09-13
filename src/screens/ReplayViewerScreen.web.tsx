// src/screens/ReplayViewerScreen.web.tsx

import {
  AlliveLoadingScreen,
} from "../components/loading/AlliveLoadingScreen";

import {
  ReplayViewerScreenBase,
} from "../components/live/replay/viewer/ReplayViewerScreenBase";

type ReplayViewerScreenProps = {
  requestedReplayId?: string | null;

  onOpenUser?: (
    userId: string,
  ) => void;
};

export function ReplayViewerScreen({
  requestedReplayId = null,
  onOpenUser,
}: ReplayViewerScreenProps) {
  return (
    <ReplayViewerScreenBase
      requestedReplayId={
        requestedReplayId
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
