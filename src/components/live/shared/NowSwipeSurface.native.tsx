// src/components/live/shared/NowSwipeSurface.native.tsx

import {
  type PropsWithChildren,
  useMemo,
} from "react";

import {
  PanResponder,
  StyleSheet,
  View,
} from "react-native";

type NowSwipeSurfaceProps =
  PropsWithChildren<{
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
  }>;

const SWIPE_THRESHOLD = 56;
const DIRECTION_LOCK_THRESHOLD = 12;

export function NowSwipeSurface({
  children,
  onSwipeUp,
  onSwipeDown,
}: NowSwipeSurfaceProps) {
  const panResponder =
    useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder:
            () => false,

          onStartShouldSetPanResponderCapture:
            () => false,

          onMoveShouldSetPanResponder:
            (_, gestureState) => {
              const verticalDistance =
                Math.abs(
                  gestureState.dy,
                );

              const horizontalDistance =
                Math.abs(
                  gestureState.dx,
                );

              return (
                verticalDistance >
                  DIRECTION_LOCK_THRESHOLD &&
                verticalDistance >
                  horizontalDistance
              );
            },

          onMoveShouldSetPanResponderCapture:
            (_, gestureState) => {
              const verticalDistance =
                Math.abs(
                  gestureState.dy,
                );

              const horizontalDistance =
                Math.abs(
                  gestureState.dx,
                );

              return (
                verticalDistance >
                  DIRECTION_LOCK_THRESHOLD &&
                verticalDistance >
                  horizontalDistance
              );
            },

          onPanResponderRelease:
            (_, gestureState) => {
              if (
                Math.abs(
                  gestureState.dy,
                ) <
                SWIPE_THRESHOLD
              ) {
                return;
              }

              if (
                gestureState.dy < 0
              ) {
                onSwipeUp?.();
                return;
              }

              onSwipeDown?.();
            },

          onPanResponderTerminationRequest:
            () => true,
        }),
      [
        onSwipeDown,
        onSwipeUp,
      ],
    );

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers}
    >
      {children}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });
