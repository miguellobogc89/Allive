// src/screens/NowScreen.tsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  StyleSheet,
  View,
} from "react-native";

import {
  getFollowingFeed,
} from "../api/followingApi";

import {
  getActiveLives,
} from "../api/liveApi";

import {
  getReplays,
  type ReplayItem,
} from "../api/replayApi";

import {
  useAuth,
} from "../auth/AuthContext";

import type {
  ActiveLive,
} from "../components/live/types";

import {
  AlliveLoadingScreen,
} from "../components/loading/AlliveLoadingScreen";

import {
  NowContentGrid,
} from "../components/now/NowContentGrid";

import {
  NowHeader,
} from "../components/now/NowHeader";

import {
  NowTabs,
} from "../components/now/NowTabs";

import type {
  NowGridItem,
  NowSection,
} from "../components/now/now.types";

import {
  MapScreen,
} from "../maps/MapScreen";

import {
  LiveViewerScreen,
} from "./LiveViewerScreen.native";

import {
  ReplayViewerScreen,
} from "./ReplayViewerScreen.native";

type NowScreenProps = {
  requestedLiveId?: string | null;
  requestedReplayId?: string | null;

  unreadNotifications?: number;

  onOpenSearch?: () => void;

  onOpenNotifications?: () => void;

  onOpenUser?: (
    userId: string,
  ) => void;
};

export function NowScreen({
  requestedLiveId = null,
  requestedReplayId = null,
  unreadNotifications = 0,
  onOpenSearch,
  onOpenNotifications,
  onOpenUser,
}: NowScreenProps) {
  const {
    token,
  } = useAuth();

  const [
    activeSection,
    setActiveSection,
  ] = useState<NowSection>(
    "now",
  );

  const [
    lives,
    setLives,
  ] = useState<
    ActiveLive[]
  >([]);

  const [
    replays,
    setReplays,
  ] = useState<
    ReplayItem[]
  >([]);

  const [
    followingLives,
    setFollowingLives,
  ] = useState<
    ActiveLive[]
  >([]);

  const [
    followingReplays,
    setFollowingReplays,
  ] = useState<
    ReplayItem[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    followingLoading,
    setFollowingLoading,
  ] = useState(false);

  const [
    followingError,
    setFollowingError,
  ] = useState<
    string | null
  >(null);

  const [
    selectedLiveId,
    setSelectedLiveId,
  ] = useState<
    string | null
  >(null);

  const [
    selectedReplayId,
    setSelectedReplayId,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (
      requestedLiveId ||
      requestedReplayId
    ) {
      setLoading(
        false,
      );

      return;
    }

    const controller =
      new AbortController();

    async function loadContent() {
      try {
        setError(
          null,
        );

        const nextLives =
          await getActiveLives(
            controller.signal,
          );

          console.log(
  "[ANDROID NOW LIVES]",
  nextLives.map((live) => ({
    id: live.id,
    thumbnailUrl: live.thumbnailUrl,
  })),
);

        const nextReplays =
          await getReplays(
            controller.signal,
          );

        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        setLives(
          nextLives,
        );

        setReplays(
          nextReplays,
        );
      } catch (loadError) {
        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        console.error(
          "Allive NOW error:",
          loadError,
        );

        setError(
          "No se pudo cargar el contenido.",
        );
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setLoading(
            false,
          );
        }
      }
    }

    void loadContent();

    const interval =
      setInterval(
        loadContent,
        5000,
      );

    return () => {
      controller.abort();

      clearInterval(
        interval,
      );
    };
  }, [
    requestedLiveId,
    requestedReplayId,
  ]);

  useEffect(() => {
    if (
      activeSection !==
      "following"
    ) {
      return;
    }

    if (!token) {
      setFollowingLives(
        [],
      );

      setFollowingReplays(
        [],
      );

      setFollowingError(
        "Inicia sesión para ver a las personas que sigues.",
      );

      setFollowingLoading(
        false,
      );

      return;
    }

    const controller =
      new AbortController();

    async function loadFollowing() {
      try {
        setFollowingError(
          null,
        );

        const result =
          await getFollowingFeed(
            token!,
            controller.signal,
          );

        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        setFollowingLives(
          result.lives,
        );

        setFollowingReplays(
          result.replays,
        );
      } catch (loadError) {
        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        console.error(
          "Error cargando Siguiendo:",
          loadError,
        );

        setFollowingError(
          "No se pudo cargar Siguiendo.",
        );
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setFollowingLoading(
            false,
          );
        }
      }
    }

    setFollowingLoading(
      true,
    );

    void loadFollowing();

    const interval =
      setInterval(
        loadFollowing,
        5000,
      );

    return () => {
      controller.abort();

      clearInterval(
        interval,
      );
    };
  }, [
    activeSection,
    token,
  ]);

  const gridItems =
    useMemo<
      NowGridItem[]
    >(
      () => [
        ...lives.map(
          (live) => ({
            type:
              "live" as const,

            live,
          }),
        ),

        ...replays.map(
          (replay) => ({
            type:
              "replay" as const,

            replay,
          }),
        ),
      ],
      [
        lives,
        replays,
      ],
    );

  const followingItems =
    useMemo<
      NowGridItem[]
    >(
      () => [
        ...followingLives.map(
          (live) => ({
            type:
              "live" as const,

            live,
          }),
        ),

        ...followingReplays.map(
          (replay) => ({
            type:
              "replay" as const,

            replay,
          }),
        ),
      ],
      [
        followingLives,
        followingReplays,
      ],
    );

  const openItem =
    useCallback(
      (
        item:
          NowGridItem,
      ) => {
        if (
          item.type ===
          "live"
        ) {
          setSelectedLiveId(
            item.live.id,
          );

          setSelectedReplayId(
            null,
          );

          return;
        }

        setSelectedReplayId(
          item.replay.id,
        );

        setSelectedLiveId(
          null,
        );
      },
      [],
    );

  if (
    requestedReplayId ||
    selectedReplayId
  ) {
    return (
      <ReplayViewerScreen
        requestedReplayId={
          requestedReplayId ??
          selectedReplayId
        }
        onOpenUser={
          onOpenUser
        }
      />
    );
  }

  if (
    requestedLiveId ||
    selectedLiveId
  ) {
    return (
      <LiveViewerScreen
        requestedLiveId={
          requestedLiveId ??
          selectedLiveId
        }
        onOpenUser={
          onOpenUser
        }
      />
    );
  }

  if (
    loading
  ) {
    return (
      <AlliveLoadingScreen />
    );
  }

  return (
    <View
      style={
        styles.screen
      }
    >
      <NowHeader
        unreadNotifications={
          unreadNotifications
        }
        onOpenSearch={
          onOpenSearch
        }
        onOpenNotifications={
          onOpenNotifications
        }
      />

      <NowTabs
        activeSection={
          activeSection
        }
        onChange={
          setActiveSection
        }
      />

      {activeSection ===
      "now" ? (
        <NowContentGrid
          items={
            gridItems
          }
          error={
            error
          }
          onItemPress={
            openItem
          }
        />
      ) : activeSection ===
        "map" ? (
        <View
          style={
            styles.section
          }
        >
          <MapScreen />
        </View>
      ) : followingLoading ? (
        <View
          style={
            styles.section
          }
        >
          <AlliveLoadingScreen />
        </View>
      ) : (
        <NowContentGrid
          items={
            followingItems
          }
          error={
            followingError
          }
          emptyTitle="No hay contenido nuevo"
          emptyDescription="Cuando las personas que sigues hagan un directo o guarden un replay, aparecerá aquí."
          onItemPress={
            openItem
          }
        />
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        "#020609",
    },

    section: {
      flex: 1,
    },
  });