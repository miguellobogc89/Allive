// src/components/live/replay/overlay/ReplayOverlay.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  Pressable,
  StyleSheet,
  Text,
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

function formatCount(
  count: number,
) {
  if (count >= 1000000) {
    const value =
      count / 1000000;

    return `${value.toFixed(
      value >= 10
        ? 0
        : 1,
    )}M`;
  }

  if (count >= 1000) {
    const value =
      count / 1000;

    return `${value.toFixed(
      value >= 10
        ? 0
        : 1,
    )}K`;
  }

  return String(count);
}

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
  const hasPlaybackControls =
    Boolean(
      onPlaybackToggle &&
        onSeek &&
        onSkipBackward &&
        onSkipForward &&
        onToggleMute,
    );

  const replayCommentCount =
    0;

  return (
    <View
      style={styles.overlay}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.04)",
          "rgba(0,0,0,0.18)",
          "rgba(0,0,0,0.58)",
        ]}
        locations={[
          0,
          0.42,
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
          onPlaybackToggle
        }
        disabled={
          !onPlaybackToggle
        }
        accessibilityRole="button"
        accessibilityLabel={
          playbackPaused
            ? "Reproducir replay"
            : "Pausar replay"
        }
      />

      {playbackPaused ? (
        <View
          style={
            styles.pausedControls
          }
          pointerEvents="box-none"
        >
          <Pressable
            style={({
              pressed,
            }) => [
              styles.skipButton,
              pressed &&
                styles.controlPressed,
            ]}
            onPress={
              onSkipBackward
            }
            disabled={
              !onSkipBackward
            }
            accessibilityRole="button"
            accessibilityLabel="Retroceder 15 segundos"
          >
            <Ionicons
              name="arrow-undo-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.skipText
              }
            >
              15
            </Text>
          </Pressable>

          <Pressable
            style={({
              pressed,
            }) => [
              styles.playButton,
              pressed &&
                styles.controlPressed,
            ]}
            onPress={
              onPlaybackToggle
            }
            disabled={
              !onPlaybackToggle
            }
            accessibilityRole="button"
            accessibilityLabel="Reproducir"
          >
            <Ionicons
              name="play"
              size={38}
              color="#FFFFFF"
              style={
                styles.playIcon
              }
            />
          </Pressable>

          <Pressable
            style={({
              pressed,
            }) => [
              styles.skipButton,
              pressed &&
                styles.controlPressed,
            ]}
            onPress={
              onSkipForward
            }
            disabled={
              !onSkipForward
            }
            accessibilityRole="button"
            accessibilityLabel="Avanzar 15 segundos"
          >
            <Ionicons
              name="arrow-redo-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.skipText
              }
            >
              15
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View
        style={
          styles.header
        }
        pointerEvents="box-none"
      >
        <VideoViewerHeader
          mode="replay"
          viewers={
            replay.peakViewerCount ??
            0
          }
          onClose={
            onClose
          }
        />
      </View>

      <View
        style={
          styles.identityLayer
        }
        pointerEvents="box-none"
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
      </View>

      <View
        style={
          styles.actionsLayer
        }
        pointerEvents="box-none"
      >
        <View
          style={
            styles.actionItem
          }
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              liked
                ? "Quitar me gusta"
                : "Me gusta"
            }
            disabled={
              likeLoading
            }
            hitSlop={8}
            onPress={
              onLikePress
            }
            style={({
              pressed,
            }) => [
              styles.actionButton,

              pressed &&
                styles.actionPressed,

              likeLoading &&
                styles.actionDisabled,
            ]}
          >
            <Ionicons
              name={
                liked
                  ? "heart"
                  : "heart-outline"
              }
              size={30}
              color={
                liked
                  ? "#FF3048"
                  : "#FFFFFF"
              }
            />
          </Pressable>

          <Text
            style={
              styles.actionCount
            }
          >
            {formatCount(likes)}
          </Text>
        </View>

        <View
          style={
            styles.actionItem
          }
        >
          <View
            style={
              styles.actionButton
            }
          >
            <Ionicons
              name="chatbubble-outline"
              size={27}
              color="#FFFFFF"
            />
          </View>

          <Text
            style={
              styles.actionCount
            }
          >
            {formatCount(
              replayCommentCount,
            )}
          </Text>
        </View>

        <View
          style={[
            styles.actionItem,
            styles.futureAction,
          ]}
        >
          <View
            style={
              styles.actionButton
            }
          >
            <Ionicons
              name="arrow-redo-outline"
              size={28}
              color="#FFFFFF"
            />
          </View>
        </View>

        <View
          style={
            styles.actionItem
          }
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              playbackMuted
                ? "Activar sonido"
                : "Silenciar"
            }
            disabled={
              !onToggleMute
            }
            hitSlop={8}
            onPress={
              onToggleMute
            }
            style={({
              pressed,
            }) => [
              styles.actionButton,

              pressed &&
                styles.actionPressed,
            ]}
          >
            <Ionicons
              name={
                playbackMuted
                  ? "volume-mute-outline"
                  : "volume-high-outline"
              }
              size={28}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>

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

      height: 300,
    },

    header: {
      position: "absolute",

      top: 18,
      left: 0,
      right: 0,

      zIndex: 30,
    },

    pausedControls: {
      position: "absolute",

      left: 0,
      right: 0,
      top: "50%",

      marginTop: -36,

      zIndex: 50,

      flexDirection: "row",

      alignItems: "center",
      justifyContent: "center",

      gap: 22,
    },

    playButton: {
      width: 72,
      height: 72,

      borderRadius: 36,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        "rgba(0,0,0,0.48)",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.18)",
    },

    playIcon: {
      marginLeft: 4,
    },

    skipButton: {
      width: 58,
      height: 58,

      borderRadius: 29,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        "rgba(0,0,0,0.42)",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.14)",
    },

    skipText: {
      position: "absolute",

      bottom: 6,

      color: "#FFFFFF",

      fontSize: 10,
      fontWeight: "400",
    },

    controlPressed: {
      transform: [
        {
          scale: 0.92,
        },
      ],
    },

    identityLayer: {
      position: "absolute",

      left: spacing.md,
      right: 88,
      bottom: 48,

      zIndex: 20,
    },

    actionsLayer: {
      position: "absolute",

      right: 12,
      bottom: 54,

      zIndex: 40,

      alignItems: "center",

      gap: 13,
    },

    actionItem: {
      alignItems: "center",
      justifyContent: "center",
    },

    actionButton: {
      width: 46,
      height: 42,

      alignItems: "center",
      justifyContent: "center",
    },

    actionCount: {
      marginTop: -2,

      color: "#FFFFFF",

      fontSize: 12,
      fontWeight: "700",

      textShadowColor:
        "rgba(0,0,0,0.9)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 3,
    },

    actionPressed: {
      transform: [
        {
          scale: 0.9,
        },
      ],
    },

    actionDisabled: {
      opacity: 0.5,
    },

    futureAction: {
      opacity: 0.58,
    },
  });