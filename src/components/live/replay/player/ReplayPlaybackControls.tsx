// src/components/live/replay/player/ReplayPlaybackControls.tsx

import {
  useRef,
  useState,
} from "react";

import {
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

  onSeek: (
    time: number,
  ) => void;

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
    Math.max(
      value,
      min,
    ),
    max,
  );
}

function formatTime(
  seconds: number,
) {
  const safeSeconds =
    Number.isFinite(
      seconds,
    )
      ? Math.max(
          0,
          Math.floor(
            seconds,
          ),
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
  onSeek,
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
    Number.isFinite(
      duration,
    )
      ? Math.max(
          0,
          duration,
        )
      : 0;

  const safeCurrentTime =
    Number.isFinite(
      currentTime,
    )
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

    setProgressActive(
      true,
    );
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
      setTimeout(
        () => {
          setProgressActive(
            false,
          );

          hideTimerRef.current =
            null;
        },
        1400,
      );
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
    <View
      style={
        styles.progressArea
      }
      pointerEvents="box-none"
    >
      {progressActive ? (
        <View
          style={
            styles.timeRow
          }
          pointerEvents="none"
        >
          <Text
            style={
              styles.timeText
            }
          >
            {formatTime(
              safeCurrentTime,
            )}
          </Text>

          <Text
            style={
              styles.timeText
            }
          >
            {formatTime(
              safeDuration,
            )}
          </Text>
        </View>
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
          pointerEvents="none"
          style={[
            styles.track,

            progressActive &&
              styles.trackActive,
          ]}
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
  );
}

const styles =
  StyleSheet.create({
    progressArea: {
      position:
        "absolute",

      left: 0,
      right: 0,
      bottom: 0,

      zIndex: 80,
    },

    timeRow: {
      position:
        "absolute",

      left: 12,
      right: 12,
      bottom: 22,

      flexDirection:
        "row",

      justifyContent:
        "space-between",
    },

    timeText: {
      color:
        "rgba(255,255,255,0.94)",

      fontSize: 11,
      fontWeight: "600",

      textShadowColor:
        "rgba(0,0,0,0.85)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 3,
    },

    progressTouchArea: {
      height: 30,

      justifyContent:
        "flex-end",
    },

    track: {
      height: 3,

      overflow:
        "hidden",

      backgroundColor:
        "rgba(255,255,255,0.38)",
    },

    trackActive: {
      height: 5,

      backgroundColor:
        "rgba(255,255,255,0.55)",
    },

    fill: {
      height: "100%",

      backgroundColor:
        "#FFFFFF",
    },

    thumb: {
      position:
        "absolute",

      bottom: -3,

      width: 11,
      height: 11,

      marginLeft: -5.5,

      borderRadius: 5.5,

      backgroundColor:
        "#FFFFFF",
    },
  });