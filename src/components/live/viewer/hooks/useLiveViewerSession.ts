// src/components/live/viewer/hooks/useLiveViewerSession.ts

import type {
  Room,
} from "livekit-client";

import {
  useEffect,
  useState,
} from "react";

import {
  emptyLiveAudience,
  type LiveAudience,
} from "../../liveAudience";

type UseLiveViewerSessionOptions = {
  activeLiveId?: string | null;
};

export function useLiveViewerSession({
  activeLiveId,
}: UseLiveViewerSessionOptions) {
  const [
    audience,
    setAudience,
  ] = useState<LiveAudience>(
    emptyLiveAudience(),
  );

  const [
    viewerRoom,
    setViewerRoom,
  ] = useState<Room | null>(
    null,
  );

  useEffect(() => {
    setAudience(
      emptyLiveAudience(),
    );

    setViewerRoom(
      null,
    );
  }, [
    activeLiveId,
  ]);

  return {
    audience,
    setAudience,
    viewerRoom,
    setViewerRoom,
  };
}
