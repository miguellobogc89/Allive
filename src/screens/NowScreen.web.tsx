// src/screens/NowScreen.web.tsx

import {
  LiveViewerScreen,
} from "./LiveViewerScreen.web";

type NowScreenProps = {
  requestedLiveId?: string | null;
  onOpenUser?: (userId: string) => void;
};

export function NowScreen({
  requestedLiveId = null,
  onOpenUser,
}: NowScreenProps) {
  return (
    <LiveViewerScreen
      requestedLiveId={
        requestedLiveId
      }
      onOpenUser={onOpenUser}
    />
  );
}
