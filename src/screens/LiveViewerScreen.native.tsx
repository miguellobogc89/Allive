// src/screens/LiveViewerScreen.native.tsx

import {
  useCallback,
} from "react";

import {
  ActivityIndicator,
  View,
} from "react-native";

import {
  API_URL,
} from "../api/apiConfig";

import {
  LiveVideoSurface,
} from "../components/live/LiveVideoSurface.native";

import type {
  ActiveLive,
} from "../components/live/types";

import {
  liveViewerScreenStyles as styles,
} from "../components/live/viewer/LiveViewerScreen.styles";

import {
  LiveViewerScreenBase,
} from "../components/live/viewer/LiveViewerScreenBase";

import type {
  LiveViewerNavigation,
} from "../components/live/viewer/hooks/useLiveViewerFeed";

import {
  colors,
} from "../styles";

const REFRESH_INTERVAL_MS =
  5000;

type LiveViewerScreenProps = {
  requestedLiveId?:
    | string
    | null;

  onOpenUser?: (
    userId: string,
  ) => void;

  onNavigationReady?: (
    navigation:
      LiveViewerNavigation,
  ) => void;
};

export function LiveViewerScreen({
  requestedLiveId = null,
  onOpenUser,
  onNavigationReady,
}: LiveViewerScreenProps) {
  const loadLives =
    useCallback(
      async () => {
        const response =
          await fetch(
            `${API_URL}/api/lives/active`,
          );

        if (
          !response.ok
        ) {
          throw new Error(
            `No se pudieron consultar los LIVE activos (${response.status})`,
          );
        }

        const nextLives =
          (await response.json()) as
            ActiveLive[];

        if (
          !Array.isArray(
            nextLives,
          )
        ) {
          throw new Error(
            "Respuesta inv\u00c3\u00a1lida del servidor.",
          );
        }

        return nextLives;
      },
      [],
    );

  return (
    <LiveViewerScreenBase
      requestedLiveId={
        requestedLiveId
      }
      refreshIntervalMs={
        REFRESH_INTERVAL_MS
      }
      loadLives={
        loadLives
      }
      refreshErrorLabel="Allive NOW native refresh error:"
      renderLoading={() => (
        <View
          style={
            styles.loading
          }
        >
          <ActivityIndicator
            color={
              colors.accent
            }
          />
        </View>
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
          live={
            live
          }
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
      onOpenUser={
        onOpenUser
      }
      onNavigationReady={
        onNavigationReady
      }
      showNavigation={
        false
      }
    />
  );
}
