// src/screens/ReplayViewerScreen.native.tsx

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  VideoView,
  useVideoPlayer,
} from "expo-video";

import {
  getReplays,
  type ReplayItem,
} from "../api/replayApi";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  ReplayOverlay,
} from "../components/live/replay";

import type {
  Replay,
} from "../components/live/replay/types";

import {
  useLiveViewerLikes,
} from "../components/live/viewer/hooks/useLiveViewerLikes";

import {
  colors,
} from "../styles";

type ReplayViewerScreenProps = {
  onOpenUser?: (
    userId: string,
  ) => void;
};

export function ReplayViewerScreen({
  onOpenUser,
}: ReplayViewerScreenProps) {
  const {
    identity,
    token,
  } = useAuth();

  const [
    replays,
    setReplays,
  ] = useState<ReplayItem[]>([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const activeReplay =
    replays[currentIndex] ?? null;

  const goToPreviousReplay =
    useCallback(() => {
      setCurrentIndex(
        (index) =>
          replays.length <= 1
            ? index
            : index <= 0
              ? replays.length - 1
              : index - 1,
      );
    }, [replays.length]);

  const goToNextReplay =
    useCallback(() => {
      setCurrentIndex(
        (index) =>
          replays.length <= 1
            ? index
            : index >=
                replays.length - 1
              ? 0
              : index + 1,
      );
    }, [replays.length]);

  useEffect(() => {
    const controller =
      new AbortController();

    async function load() {
      try {
        const result =
          await getReplays(
            controller.signal,
          );

        setReplays(result);
        setCurrentIndex(0);
      } catch (error) {
        if (
          !controller.signal.aborted
        ) {
          console.error(
            "Allive replays error:",
            error,
          );
        }
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, []);

  if (
    loading &&
    !activeReplay
  ) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          color={colors.accent}
        />
      </View>
    );
  }

  if (!activeReplay) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            No hay replays disponibles
          </Text>

          <Text
            style={styles.emptySubtitle}
          >
            Los directos recientes aparecerán aquí.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ReplayContent
      replay={activeReplay}
      currentIndex={currentIndex}
      totalReplays={replays.length}
      viewerIdentity={identity}
      authToken={token}
      onPrevious={
        goToPreviousReplay
      }
      onNext={goToNextReplay}
      onOpenUser={onOpenUser}
    />
  );
}

type ReplayContentProps = {
  replay: Replay;

  currentIndex: number;
  totalReplays: number;

  viewerIdentity:
    ReturnType<
      typeof useAuth
    >["identity"];

  authToken:
    string | null;

  onPrevious: () => void;
  onNext: () => void;

  onOpenUser?: (
    userId: string,
  ) => void;
};

function ReplayContent({
  replay,

  currentIndex,
  totalReplays,

  viewerIdentity,
  authToken,

  onPrevious,
  onNext,

  onOpenUser,
}: ReplayContentProps) {
  const {
    liked,
    likeCount,
    likeLoading,
    toggleLike,
  } = useLiveViewerLikes({
    liveId: replay.id,

    viewerIdentity,

    authToken,
  });

  const player = useVideoPlayer(
    replay.recordingUrl,
    (videoPlayer) => {
      videoPlayer.loop = false;
      videoPlayer.play();
    },
  );

  const creatorId =
    replay.creator?.id;

  return (
    <View style={styles.container}>
      <VideoView
        key={replay.id}
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls
      />

      <ReplayOverlay
        replay={replay}
        currentIndex={currentIndex}
        totalReplays={totalReplays}
        likes={likeCount}
        liked={liked}
        likeLoading={likeLoading}
        onLikePress={toggleLike}
        onPrevious={onPrevious}
        onNext={onNext}
        onOpenCreator={
          creatorId
            ? () => {
                onOpenUser?.(
                  creatorId,
                );
              }
            : undefined
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      position: "relative",

      backgroundColor:
        colors.background,
    },

video: {
  ...StyleSheet.absoluteFill,

  width: "100%",
  height: "100%",

  backgroundColor:
    colors.background,
},

    loading: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        colors.background,
    },

    emptyState: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 32,
    },

    emptyTitle: {
      color: "#FFFFFF",

      fontSize: 17,
      fontWeight: "600",

      textAlign: "center",
    },

    emptySubtitle: {
      marginTop: 6,

      color:
        "rgba(255,255,255,0.58)",

      fontSize: 14,
      fontWeight: "400",

      textAlign: "center",
    },
  });