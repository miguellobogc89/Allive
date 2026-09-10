// src/screens/ReplayViewerScreen.web.tsx

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";

import {
  getReplays,
  type ReplayItem,
} from "../api/replayApi";

import {
  ReplayOverlay,
} from "../components/live/replay";

import type {
  Replay,
} from "../components/live/replay/types";

import {
  colors,
} from "../styles";

type ReplayViewerScreenProps = {
  onOpenUser?: (
    userId: string,
  ) => void;

  onOpenLives?: () => void;
};

export function ReplayViewerScreen({
  onOpenUser,
  onOpenLives,
}: ReplayViewerScreenProps) {
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

  const [
    commentValue,
    setCommentValue,
  ] = useState("");

  const [
    liked,
    setLiked,
  ] = useState(false);

  const activeReplay =
    replays[currentIndex] ?? null;

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

      setLiked(false);
      setCommentValue("");
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

      setLiked(false);
      setCommentValue("");
    }, [replays.length]);

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
      <View
        style={styles.container}
      />
    );
  }

  const replay: Replay =
    activeReplay;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={
          replay.thumbnailUrl
            ? {
                uri:
                  replay.thumbnailUrl,
              }
            : undefined
        }
        resizeMode="cover"
        style={styles.media}
      >
        <ReplayOverlay
          replay={replay}
          currentIndex={
            currentIndex
          }
          totalReplays={
            replays.length
          }
          commentValue={
            commentValue
          }
          liked={liked}
          onPrevious={
            goToPreviousReplay
          }
          onNext={
            goToNextReplay
          }
          onCommentChange={
            setCommentValue
          }
          onCommentSend={() => {
            setCommentValue("");
          }}
          onLikePress={() => {
            setLiked(
              (value) => !value,
            );
          }}
          onOpenCreator={
            replay.creator?.id
              ? () => {
                  onOpenUser?.(
                    replay.creator!.id!,
                  );
                }
              : undefined
          }
        />
      </ImageBackground>
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

    media: {
      flex: 1,
      position: "relative",
      backgroundColor:
        colors.background,
    },

    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.background,
    },
  });