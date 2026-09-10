// src/screens/LiveViewerScreen.web.tsx

import type {
  Room,
} from "livekit-client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  API_URL,
} from "../api/apiConfig";

import {
  LiveVideoSurface,
} from "../components/live/LiveVideoSurface.web";

import {
  LiveViewerOverlay,
} from "../components/live/viewer/overlay/LiveViewerOverlay";

import {
  emptyLiveAudience,
  type LiveAudience,
} from "../components/live/liveAudience";

import type {
  ActiveLive,
} from "../components/live/types";

import {
  colors,
} from "../styles";

const REFRESH_INTERVAL_MS =
  5000;

type LiveViewerScreenProps = {
  requestedLiveId?: string | null;
  onOpenUser?: (userId: string) => void;
};

export function LiveViewerScreen({
  requestedLiveId = null,
  onOpenUser,
}: LiveViewerScreenProps) {
  const {
    identity,
    user,
    token,
  } = useAuth();

  const [lives, setLives] =
    useState<ActiveLive[]>([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

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

  const [
    loadingLives,
    setLoadingLives,
  ] = useState(true);

  const activeLive =
    lives[currentIndex] ??
    null;

    useEffect(() => {
  if (!requestedLiveId) {
    return;
  }

  const requestedIndex =
    lives.findIndex(
      (live) =>
        live.id === requestedLiveId,
    );

  if (requestedIndex < 0) {
    return;
  }

  setCurrentIndex(
    requestedIndex,
  );
}, [
  requestedLiveId,
  lives,
]);

  const loadActiveLives =
    useCallback(
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/api/lives/active`,
            );

          if (!response.ok) {
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
              "Respuesta inválida del servidor.",
            );
          }

          setLives(
            (
              previousLives,
            ) => {
              if (
                nextLives.length ===
                0
              ) {
                return [];
              }

              const currentLive =
                previousLives[
                  currentIndex
                ];

              if (
                !currentLive
              ) {
                return nextLives;
              }

              const stillActiveIndex =
                nextLives.findIndex(
                  (live) =>
                    live.id ===
                    currentLive.id,
                );

              if (
                stillActiveIndex ===
                -1
              ) {
                return nextLives;
              }

              if (
                stillActiveIndex !==
                currentIndex
              ) {
                const reordered =
                  [
                    ...nextLives,
                  ];

                const [
                  stillActiveLive,
                ] =
                  reordered.splice(
                    stillActiveIndex,
                    1,
                  );

                reordered.splice(
                  Math.min(
                    currentIndex,
                    reordered.length,
                  ),
                  0,
                  stillActiveLive,
                );

                return reordered;
              }

              return nextLives;
            },
          );

          setCurrentIndex(
            (index) =>
              nextLives.length ===
              0
                ? 0
                : Math.min(
                    index,
                    nextLives.length -
                      1,
                  ),
          );
        } catch (error) {
          console.error(
            "Allive NOW refresh error:",
            error,
          );
        } finally {
          setLoadingLives(false);
        }
      },
      [currentIndex],
    );

  useEffect(() => {
    void loadActiveLives();

    const interval =
      window.setInterval(
        loadActiveLives,
        REFRESH_INTERVAL_MS,
      );

    return () =>
      window.clearInterval(
        interval,
      );
  }, [loadActiveLives]);

  useEffect(() => {
    setAudience(
      emptyLiveAudience(),
    );

    setViewerRoom(null);
  }, [activeLive?.id]);

  const goToPreviousLive =
    useCallback(() => {
      setCurrentIndex(
        (index) =>
          lives.length <= 1
            ? index
            : index <= 0
              ? lives.length -
                1
              : index - 1,
      );
    }, [lives.length]);

  const goToNextLive =
    useCallback(() => {
      setCurrentIndex(
        (index) =>
          lives.length <= 1
            ? index
            : index >=
                lives.length -
                  1
              ? 0
              : index + 1,
      );
    }, [lives.length]);

  return (
    <View
      style={
        styles.container
      }
    >
      {loadingLives &&
      !activeLive ? (
        <View
          style={
            styles.loading
          }
        >
          <ActivityIndicator
            color={colors.accent}
          />
        </View>
      ) : (
        <LiveVideoSurface
          live={activeLive}
          viewerIdentity={
            identity
          }
          viewerUser={user}
          authToken={token}
          onAudienceChange={
            setAudience
          }
          onRoomChange={
            setViewerRoom
          }
        />
      )}

      {activeLive ? (
        <LiveViewerOverlay
          live={activeLive}
          room={viewerRoom}
          audience={audience}
          viewerIdentity={
            identity
          }
          authToken={token}
          currentIndex={
            currentIndex
          }
          totalLives={
            lives.length
          }
          onPreviousLive={
            goToPreviousLive
          }
          onNextLive={
            goToNextLive
          }
          onOpenUser={onOpenUser}
        />
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      position:
        "relative",
      backgroundColor:
        colors.background,
    },

    loading: {
      ...StyleSheet.absoluteFill,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.background,
    },
  });
