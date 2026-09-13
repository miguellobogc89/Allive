// src/components/live/replay/player/ReplayPlaybackControls.tsx

import {
  useRef,
  useState,
} from "react";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ReplayPlaybackControlsProps = {
  currentTime: number;
  duration: number;

  paused: boolean;
  muted: boolean;

  onTogglePlayback: () => void;
  onSeek: (time: number) => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onToggleMute: () => void;
};

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

function formatTime(
  seconds: number,
) {
  const safeSeconds =
    Number.isFinite(seconds)
      ? Math.max(
          0,
          Math.floor(seconds),
        )
      : 0;

  const minutes =
    Math.floor(
      safeSeconds / 60,
    );

  const remainingSeconds =
    safeSeconds % 60;

  return `${minutes}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export function ReplayPlaybackControls({
  currentTime,
  duration,

  paused,
  muted,

  onTogglePlayback,
  onSeek,
  onSkipBackward,
  onSkipForward,
  onToggleMute,
}: ReplayPlaybackControlsProps) {
  const [
    barWidth,
    setBarWidth,
  ] = useState(0);

  const [
    progressActive,
    setProgressActive,
  ] = useState(false);

  const hideTimerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const safeDuration =
    Number.isFinite(duration)
      ? Math.max(
          0,
          duration,
        )
      : 0;

  const safeCurrentTime =
    Number.isFinite(currentTime)
      ? clamp(
          currentTime,
          0,
          safeDuration ||
            Math.max(
              0,
              currentTime,
            ),
        )
      : 0;

  const progress =
    safeDuration > 0
      ? clamp(
          safeCurrentTime /
            safeDuration,
          0,
          1,
        )
      : 0;

  function activateProgress() {
    if (
      hideTimerRef.current
    ) {
      clearTimeout(
        hideTimerRef.current,
      );

      hideTimerRef.current =
        null;
    }

    setProgressActive(true);
  }

  function scheduleProgressHide() {
    if (
      hideTimerRef.current
    ) {
      clearTimeout(
        hideTimerRef.current,
      );
    }

    hideTimerRef.current =
      setTimeout(() => {
        setProgressActive(
          false,
        );

        hideTimerRef.current =
          null;
      }, 1400);
  }

  function seekFromPosition(
    locationX: number,
  ) {
    if (
      barWidth <= 0 ||
      safeDuration <= 0
    ) {
      return;
    }

    const ratio =
      clamp(
        locationX /
          barWidth,
        0,
        1,
      );

    onSeek(
      ratio *
        safeDuration,
    );
  }

  return (
    <>
      {paused ? (
        <View
          style={
            styles.centerControls
          }
          pointerEvents="box-none"
        >
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={
              onToggleMute
            }
            accessibilityRole="button"
            accessibilityLabel={
              muted
                ? "Activar sonido"
                : "Silenciar"
            }
          >
            <Ionicons
              name={
                muted
                  ? "volume-mute"
                  : "volume-high"
              }
              size={24}
              color="#FFFFFF"
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={
              onSkipBackward
            }
            accessibilityRole="button"
            accessibilityLabel="Retroceder 10 segundos"
          >
            <Text
              style={
                styles.skipText
              }
            >
              -10
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.playButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={
              onTogglePlayback
            }
            accessibilityRole="button"
            accessibilityLabel="Reproducir"
          >
            <Ionicons
              name="play"
              size={34}
              color="#FFFFFF"
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={
              onSkipForward
            }
            accessibilityRole="button"
            accessibilityLabel="Avanzar 15 segundos"
          >
            <Text
              style={
                styles.skipText
              }
            >
              +15
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View
        style={
          styles.progressArea
        }
        pointerEvents="box-none"
      >
        {progressActive ? (
          <Text
            style={
              styles.timeText
            }
            pointerEvents="none"
          >
            {formatTime(
              safeCurrentTime,
            )}{" / "}
            {formatTime(
              safeDuration,
            )}
          </Text>
        ) : null}

        <View
          style={
            styles.progressTouchArea
          }
          onLayout={(
            event,
          ) => {
            setBarWidth(
              event.nativeEvent
                .layout.width,
            );
          }}
          onStartShouldSetResponder={() =>
            true
          }
          onMoveShouldSetResponder={() =>
            true
          }
          onResponderGrant={(
            event,
          ) => {
            activateProgress();

            seekFromPosition(
              event.nativeEvent
                .locationX,
            );
          }}
          onResponderMove={(
            event,
          ) => {
            activateProgress();

            seekFromPosition(
              event.nativeEvent
                .locationX,
            );
          }}
          onResponderRelease={() => {
            scheduleProgressHide();
          }}
          onResponderTerminate={() => {
            scheduleProgressHide();
          }}
        >
          <View
            style={[
              styles.track,
              progressActive &&
                styles.trackActive,
            ]}
            pointerEvents="none"
          >
            <View
              style={[
                styles.fill,
                {
                  width:
                    `${progress * 100}%`,
                },
              ]}
            />
          </View>

          {progressActive ? (
            <View
              pointerEvents="none"
              style={[
                styles.thumb,
                {
                  left:
                    `${progress * 100}%`,
                },
              ]}
            />
          ) : null}
        </View>
      </View>
    </>
  );
}

const styles =
  StyleSheet.create({
    centerControls: {
      position:
        "absolute",

      left: 0,
      right: 0,
      top: "50%",

      marginTop: -34,

      zIndex: 70,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 14,
    },

    secondaryButton: {
      width: 52,
      height: 52,

      borderRadius: 26,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(0,0,0,0.52)",
    },

    playButton: {
      width: 68,
      height: 68,

      borderRadius: 34,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(0,0,0,0.64)",
    },

    skipText: {
      color: "#FFFFFF",

      fontSize: 14,
      fontWeight: "700",
    },

    pressed: {
      opacity: 0.68,
    },

    progressArea: {
      position:
        "absolute",

      left: 14,
      right: 14,
      bottom: 4,

      zIndex: 80,
    },

    timeText: {
      marginBottom: 2,

      color: "#FFFFFF",

      fontSize: 11,
      fontWeight: "600",

      textShadowColor:
        "rgba(0,0,0,0.75)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 3,
    },

    progressTouchArea: {
      height: 24,

      justifyContent:
        "center",
    },

    track: {
      height: 2,

      borderRadius: 999,

      overflow:
        "hidden",

      backgroundColor:
        "rgba(255,255,255,0.34)",
    },

    trackActive: {
      height: 4,

      backgroundColor:
        "rgba(255,255,255,0.52)",
    },

    fill: {
      height: "100%",

      backgroundColor:
        "#FFFFFF",
    },

    thumb: {
      position:
        "absolute",

      top: "50%",

      width: 12,
      height: 12,

      marginLeft: -6,
      marginTop: -6,

      borderRadius: 6,

      backgroundColor:
        "#FFFFFF",
    },
  });
