// src/components/live/replay/overlay/ReplayOverlay.tsx

import {
  useRef,
  useState,
} from "react";

import {
  Ionicons,
} from "@expo/vector-icons";

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
  ReplayLikeButton,
} from "../controls";

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

  liked: boolean;
  likeLoading?: boolean;
  onLikePress: () => void;

  followLoading?: boolean;
  isFollowing?: boolean;

  onPrevious: () => void;
  onNext: () => void;

  onFollowPress?: () => void;
  onOpenCreator?: () => void;
  onOpenLives?: () => void;

  showNavigation?: boolean;

  playbackPaused?: boolean;
  onPlaybackToggle?: () => void;
};

export function ReplayOverlay({
  replay,

  currentIndex,
  totalReplays,

  likes,

  liked,
  likeLoading = false,
  onLikePress,

  followLoading = false,
  isFollowing = false,

  onPrevious,
  onNext,

  onFollowPress,
  onOpenCreator,

  showNavigation = true,

  playbackPaused = false,
  onPlaybackToggle,
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

  const nativePlaybackMode =
    Boolean(
      onPlaybackToggle,
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

      <ReplayHeader
        likes={likes}
      />

      <Animated.View
        pointerEvents={
          nativePlaybackMode ||
          contentVisible
            ? "box-none"
            : "none"
        }
        style={[
          styles.identityLayer,
          nativePlaybackMode
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
          nativePlaybackMode ||
          contentVisible
            ? "auto"
            : "none"
        }
        style={[
          styles.likeLayer,
          nativePlaybackMode
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

      {playbackPaused ? (
        <View
          style={
            styles.playIndicator
          }
          pointerEvents="none"
        >
          <Ionicons
            name="play"
            size={34}
            color="#FFFFFF"
          />
        </View>
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

    playIndicator: {
      position: "absolute",

      left: "50%",
      top: "50%",

      width: 68,
      height: 68,

      marginLeft: -34,
      marginTop: -34,

      borderRadius: 34,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        "rgba(0,0,0,0.56)",

      zIndex: 40,
    },
  });
