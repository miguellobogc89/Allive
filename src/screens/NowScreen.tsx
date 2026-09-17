// src/screens/NowScreen.tsx

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  View,
} from "react-native";

import {
  useAuth,
} from "../auth/AuthContext";

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
  NowLiveViewer,
} from "../components/now/NowLiveViewer";

import {
  NowMapSection,
} from "../components/now/NowMapSection";

import {
  NowReplayViewer,
} from "../components/now/NowReplayViewer";

import {
  nowScreenStyles as styles,
} from "../components/now/NowScreen.styles";

import {
  NowTabs,
} from "../components/now/NowTabs";

import type {
  NowGridItem,
  NowSection,
} from "../components/now/now.types";

import {
  useFollowingFeed,
} from "../components/now/useFollowingFeed";

import {
  useNowFeed,
} from "../components/now/useNowFeed";

type NowScreenProps = {
  requestedLiveId?: string | null;
  requestedReplayId?: string | null;

  unreadNotifications?: number;

  onCloseRequestedVideo?:
  () => void;

  onOpenSearch?: () => void;

onVideoViewerVisibleChange?: (
  mode:
    | "live"
    | "replay"
    | null,
) => void;

  onOpenNotifications?: () => void;

  onOpenUser?: (
    userId: string,
  ) => void;
};

export function NowScreen({
  requestedLiveId = null,
  requestedReplayId = null,
  unreadNotifications = 0,
  onCloseRequestedVideo,
  onOpenSearch,
  onOpenNotifications,
  onOpenUser,
  onVideoViewerVisibleChange,
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

const videoViewerVisible =
  Boolean(
    requestedLiveId ||
    requestedReplayId ||
    selectedLiveId ||
    selectedReplayId,
  );

const videoViewerMode:
  | "live"
  | "replay"
  | null =
    requestedReplayId ||
    selectedReplayId
      ? "replay"
      : requestedLiveId ||
          selectedLiveId
        ? "live"
        : null;

useEffect(() => {
  onVideoViewerVisibleChange?.(
    videoViewerMode,
  );

  return () => {
    onVideoViewerVisibleChange?.(
      null,
    );
  };
}, [
  videoViewerMode,
  onVideoViewerVisibleChange,
]);

const {
  lives,
  gridItems,
  loading,
  error,
} = useNowFeed({
    requestedLiveId,
    requestedReplayId,
  });

  const {
    followingItems,
    followingLoading,
    followingError,
  } = useFollowingFeed({
    activeSection,
    token,
  });

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

const closeLive =
  useCallback(() => {
    if (requestedLiveId) {
      onCloseRequestedVideo?.();
      return;
    }

    setSelectedLiveId(
      null,
    );
  }, [
    requestedLiveId,
    onCloseRequestedVideo,
  ]);

const closeReplay =
  useCallback(() => {
    if (requestedReplayId) {
      onCloseRequestedVideo?.();
      return;
    }

    setSelectedReplayId(
      null,
    );
  }, [
    requestedReplayId,
    onCloseRequestedVideo,
  ]);

  if (
    requestedReplayId ||
    selectedReplayId
  ) {
    return (
<NowReplayViewer
  requestedReplayId={
    requestedReplayId
  }
  selectedReplayId={
    selectedReplayId
  }
  onClose={
    closeReplay
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
      <NowLiveViewer
        requestedLiveId={
          requestedLiveId
        }
        selectedLiveId={
          selectedLiveId
        }
        lives={
          lives
        }
        onClose={
          closeLive
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
          <NowMapSection
            onOpenLive={(
              liveId,
            ) => {
              setSelectedLiveId(
                liveId,
              );

              setSelectedReplayId(
                null,
              );
            }}
            onOpenReplay={(
              replayId,
            ) => {
              setSelectedReplayId(
                replayId,
              );

              setSelectedLiveId(
                null,
              );
            }}
          />
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
          emptyDescription="Cuando las personas que sigues hagan un directo o guarden un replay, aparecer\u00e1 aqu\u00ed."
          onItemPress={
            openItem
          }
        />
      )}
    </View>
  );
}