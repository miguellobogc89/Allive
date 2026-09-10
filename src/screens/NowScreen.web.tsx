// src/screens/NowScreen.web.tsx

import {
  useState,
} from "react";

import {
  LiveViewerScreen,
} from "./LiveViewerScreen.web";

import {
  ReplayViewerScreen,
} from "./ReplayViewerScreen.web";

type NowMode =
  | "live"
  | "replay";

type NowScreenProps = {
  requestedLiveId?: string | null;
  onOpenUser?: (
    userId: string,
  ) => void;
};

export function NowScreen({
  requestedLiveId = null,
  onOpenUser,
}: NowScreenProps) {
  const [
    mode,
    setMode,
  ] = useState<NowMode>(
    "live",
  );

  if (mode === "replay") {
    return (
      <ReplayViewerScreen
        onOpenUser={onOpenUser}
        onOpenLives={() => {
          setMode("live");
        }}
      />
    );
  }

  return (
    <LiveViewerScreen
      requestedLiveId={
        requestedLiveId
      }
      onOpenUser={onOpenUser}
      onOpenReplays={() => {
        setMode("replay");
      }}
    />
  );
}