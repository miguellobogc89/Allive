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
  LiveViewerIdentity,
} from "../../viewer/header/LiveViewerIdentity";

import {
  LiveViewerNavigation,
} from "../../viewer/navigation/LiveViewerNavigation";

import {
  ReplayHeader,
} from "../header/ReplayHeader";

import type {
  Replay,
} from "../types";

type ReplayOverlayProps = {
  replay: Replay;

  currentIndex: number;
  totalReplays: number;

  likes: number;

  followLoading?: boolean;
  isFollowing?: boolean;

  onPrevious: () => void;
  onNext: () => void;

  onFollowPress?: () => void;
  onOpenCreator?: () => void;
  onOpenLives?: () => void;
};

export function ReplayOverlay({
  replay,

  currentIndex,
  totalReplays,

  likes,

  followLoading = false,
  isFollowing = false,

  onPrevious,
  onNext,

  onFollowPress,
  onOpenCreator,
  onOpenLives,
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

  function toggleContent() {
    const nextVisible =
      !contentVisible;

    setContentVisible(nextVisible);

    Animated.parallel([
      Animated.timing(
        topOpacity,
        {
          toValue:
            nextVisible ? 1 : 0,
          duration: 180,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        topTranslateY,
        {
          toValue:
            nextVisible ? 0 : -14,
          duration: 180,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }

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
        style={styles.tapSurface}
        onPress={toggleContent}
      />

      <ReplayHeader
        likes={likes}
        onOpenLives={
          onOpenLives
        }
      />

      <Animated.View
        pointerEvents={
          contentVisible
            ? "box-none"
            : "none"
        }
        style={[
          styles.identityLayer,
          {
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

    identityLayer: {
      position: "absolute",
      top: 80,
      left: spacing.md,
      right: spacing.md,

      zIndex: 20,
    },
  });