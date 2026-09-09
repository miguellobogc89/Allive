// src/screens/NowScreen.web.tsx

import {
  LiveViewerScreen,
} from "./LiveViewerScreen.web";

type NowScreenProps = {
  requestedLiveId?: string | null;
};

export function NowScreen({
  requestedLiveId = null,
}: NowScreenProps) {
  return (
    <LiveViewerScreen
      requestedLiveId={
        requestedLiveId
      }
    />
  );
}