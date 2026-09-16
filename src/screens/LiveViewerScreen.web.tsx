// src/screens/LiveViewerScreen.web.tsx

import {
  useCallback,
} from "react";

import {
  getActiveLives,
} from "../api/liveApi";

import {
  LiveVideoSurface,
} from "../components/live/LiveVideoSurface.web";

import type {
  ActiveLive,
} from "../components/live/types";

import {
  LiveViewerScreenBase,
} from "../components/live/viewer/LiveViewerScreenBase";

import {
  AlliveLoadingScreen,
} from "../components/loading/AlliveLoadingScreen";

const REFRESH_INTERVAL_MS =
  5000;

const EMPTY_INITIAL_LIVES:
  ActiveLive[] = [];

type LiveViewerScreenProps = {
  requestedLiveId?:
    | string
    | null;

  initialLives?: ActiveLive[];

  onNoLivesAvailable?: () => void;

  onClose?: () => void;

  onOpenUser?: (
    userId: string,
  ) => void;
};

export function LiveViewerScreen({
  requestedLiveId = null,
  initialLives = EMPTY_INITIAL_LIVES,
  onNoLivesAvailable,
  onClose,
  onOpenUser,
}: LiveViewerScreenProps) {
  const loadLives =
    useCallback(
      () => getActiveLives(),
      [],
    );

  return (
    <LiveViewerScreenBase
      requestedLiveId={
        requestedLiveId
      }
      initialLives={
        initialLives
      }
      refreshIntervalMs={
        REFRESH_INTERVAL_MS
      }
      loadLives={
        loadLives
      }
      renderLoading={() => (
        <AlliveLoadingScreen />
      )}
      renderVideoSurface={({
        live,
        viewerIdentity,
        viewerUser,
        authToken,
        onAudienceChange,
        onRoomChange,
      }) => (
        <LiveVideoSurface
          live={live}
          viewerIdentity={
            viewerIdentity
          }
          viewerUser={
            viewerUser
          }
          authToken={
            authToken
          }
          onAudienceChange={
            onAudienceChange
          }
          onRoomChange={
            onRoomChange
          }
        />
      )}
      onNoLivesAvailable={
        onNoLivesAvailable
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