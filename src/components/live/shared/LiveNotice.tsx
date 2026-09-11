// src/components/live/shared/LiveNotice.tsx

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  StyleSheet,
  Text,
} from "react-native";

type LiveNoticeProps = {
  message: string | null;
  duration?: number;
  onHidden?: () => void;
};

export function LiveNotice({
  message,
  duration = 1800,
  onHidden,
}: LiveNoticeProps) {
  const [mounted, setMounted] =
    useState(false);

  const opacity =
    useRef(
      new Animated.Value(0),
    ).current;

  const translateY =
    useRef(
      new Animated.Value(-12),
    ).current;

  useEffect(() => {
    if (!message) {
      return;
    }

    setMounted(true);

    opacity.stopAnimation();
    translateY.stopAnimation();

    opacity.setValue(0);
    translateY.setValue(-12);

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        translateY,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        },
      ),
    ]).start();

    const timeout =
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(
            opacity,
            {
              toValue: 0,
              duration: 180,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            translateY,
            {
              toValue: -10,
              duration: 180,
              useNativeDriver: true,
            },
          ),
        ]).start(() => {
          setMounted(false);
          onHidden?.();
        });
      }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    message,
    duration,
    opacity,
    translateY,
    onHidden,
  ]);

  if (
    !mounted ||
    !message
  ) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.notice,
        {
          opacity,
          transform: [
            {
              translateY,
            },
          ],
        },
      ]}
    >
      <Text style={styles.text}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles =
  StyleSheet.create({
    notice: {
      position: "absolute",

      top: 154,
      alignSelf: "center",

      maxWidth: "84%",

      paddingHorizontal: 14,
      paddingVertical: 9,

      borderRadius: 8,

      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.14)",

      backgroundColor:
        "rgba(12,14,17,0.82)",

      zIndex: 45,
    },

    text: {
      color: "#FFFFFF",

      fontSize: 12,
      fontWeight: "600",

      textAlign: "center",
    },
  });