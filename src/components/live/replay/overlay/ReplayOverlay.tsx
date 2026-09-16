// src/components/live/replay/overlay/ReplayOverlay.tsx

import {
  useRef,
  useState,
} from "react";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  spacing,
} from "../../../../styles";

import {
  VideoViewerHeader,
} from "../../../video/viewer/VideoViewerHeader";

import {
  LiveViewerIdentity,
} from "../../viewer/header/LiveViewerIdentity";

import {
  LiveViewerNavigation,
} from "../../viewer/navigation/LiveViewerNavigation";

import {
  ReplayLikeButton,
} from "../controls";

import {
  ReplayPlaybackControls,
} from "../player/ReplayPlaybackControls";

import type {
  Replay,
} from "../types";

type ReplayOverlayProps = {
  replay: Replay;

  currentIndex: number;
  totalReplays: number;

  likes: number;

  liked: boolean;
  likeLoading?: boolean;
  onLikePress: () => void;

  followLoading?: boolean;
  isFollowing?: boolean;

  onPrevious: () => void;
  onNext: () => void;

  onClose?: () => void;

  onFollowPress?: () => void;
  onOpenCreator?: () => void;
  onOpenLives?: () => void;

  showNavigation?: boolean;

  playbackPaused?: boolean;
  playbackMuted?: boolean;

  currentTime?: number;
  duration?: number;

  onPlaybackToggle?: () => void;
  onSeek?: (
    time: number,
  ) => void;
  onSkipBackward?: () => void;
  onSkipForward?: () => void;
  onToggleMute?: () => void;
};

export function ReplayOverlay({
  replay,

  currentIndex,
  totalReplays,

  liked,
  likeLoading = false,
  onLikePress,

  followLoading = false,
  isFollowing = false,

  onPrevious,
  onNext,

  onClose,

  onFollowPress,
  onOpenCreator,

  showNavigation = true,

  playbackPaused = false,
  playbackMuted = false,

  currentTime = 0,
  duration = 0,

  onPlaybackToggle,
  onSeek,
  onSkipBackward,
  onSkipForward,
  onToggleMute,
}: ReplayOverlayProps) {
  const [
    contentVisible,
    setContentVisible,
  ] = useState(true);

  const topOpacity =
    useRef(
      new Animated.Value(1),
    ).current;

  const topTranslateY =
    useRef(
      new Animated.Value(0),
    ).current;

  const bottomOpacity =
    useRef(
      new Animated.Value(1),
    ).current;

  const bottomTranslateY =
    useRef(
      new Animated.Value(0),
    ).current;

  function toggleContent() {
    const nextVisible =
      !contentVisible;

    setContentVisible(
      nextVisible,
    );

    Animated.parallel([
      Animated.timing(
        topOpacity,
        {
          toValue:
            nextVisible
              ? 1
              : 0,
          duration: 180,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        topTranslateY,
        {
          toValue:
            nextVisible
              ? 0
              : -14,
          duration: 180,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        bottomOpacity,
        {
          toValue:
            nextVisible
              ? 1
              : 0,
          duration: 180,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        bottomTranslateY,
        {
          toValue:
            nextVisible
              ? 0
              : 14,
          duration: 180,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }

  function handleSurfacePress() {
    if (
      onPlaybackToggle
    ) {
      onPlaybackToggle();
      return;
    }

    toggleContent();
  }

  const playbackMode =
    Boolean(
      onPlaybackToggle,
    );

  const hasPlaybackControls =
    Boolean(
      onPlaybackToggle &&
        onSeek &&
        onSkipBackward &&
        onSkipForward &&
        onToggleMute,
    );

  return (
    <View
      style={styles.overlay}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.08)",
          "rgba(0,0,0,0.22)",
          "rgba(0,0,0,0.48)",
        ]}
        locations={[
          0,
          0.35,
          0.7,
          1,
        ]}
        style={
          styles.bottomGradient
        }
        pointerEvents="none"
      />

      <Pressable
        style={
          styles.tapSurface
        }
        onPress={
          handleSurfacePress
        }
      />

      <View
        style={styles.header}
        pointerEvents="box-none"
      >
        <VideoViewerHeader
          mode="replay"
          viewers={
            replay.peakViewerCount ??
            0
          }
          onClose={onClose}
        />
      </View>

      <Animated.View
        pointerEvents={
          playbackMode ||
          contentVisible
            ? "box-none"
            : "none"
        }
        style={[
          styles.identityLayer,

          playbackMode
            ? undefined
            : {
                opacity:
                  topOpacity,

                transform: [
                  {
                    translateY:
                      topTranslateY,
                  },
                ],
              },
        ]}
      >
        <LiveViewerIdentity
          live={replay}
          followLoading={
            followLoading
          }
          isFollowing={
            isFollowing
          }
          onFollowPress={
            onFollowPress
          }
          onOpenCreator={
            onOpenCreator
          }
        />
      </Animated.View>

      <Animated.View
        pointerEvents={
          playbackMode ||
          contentVisible
            ? "auto"
            : "none"
        }
        style={[
          styles.likeLayer,

          playbackMode
            ? undefined
            : {
                opacity:
                  bottomOpacity,

                transform: [
                  {
                    translateY:
                      bottomTranslateY,
                  },
                ],
              },
        ]}
      >
        <ReplayLikeButton
          liked={liked}
          loading={
            likeLoading
          }
          onPress={
            onLikePress
          }
        />
      </Animated.View>

      {hasPlaybackControls ? (
        <ReplayPlaybackControls
          currentTime={
            currentTime
          }
          duration={
            duration
          }
          paused={
            playbackPaused
          }
          muted={
            playbackMuted
          }
          onTogglePlayback={
            onPlaybackToggle!
          }
          onSeek={
            onSeek!
          }
          onSkipBackward={
            onSkipBackward!
          }
          onSkipForward={
            onSkipForward!
          }
          onToggleMute={
            onToggleMute!
          }
        />
      ) : null}

      {showNavigation ? (
        <LiveViewerNavigation
          currentIndex={
            currentIndex
          }
          total={
            totalReplays
          }
          onPrevious={
            onPrevious
          }
          onNext={
            onNext
          }
        />
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,

      zIndex: 10,
    },

    tapSurface: {
      ...StyleSheet.absoluteFill,

      zIndex: 1,
    },

    bottomGradient: {
      position: "absolute",

      left: 0,
      right: 0,
      bottom: 0,

      height: 190,
    },

    header: {
      position: "absolute",

      top: 18,
      left: 0,
      right: 0,

      zIndex: 30,
    },

    identityLayer: {
      position: "absolute",

      top: 80,
      left: spacing.md,
      right: spacing.md,

      zIndex: 20,
    },

    likeLayer: {
      position: "absolute",

      right: spacing.md,
      bottom: 28,

      zIndex: 30,
    },
  });