// src/components/live/broadcast/overlay/LiveBroadcastTopBar.tsx

import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type LiveBroadcastTopBarProps = {
  isLive: boolean;
  viewers: number;
  likes: number;
  onFinishLive: () => void;
};

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [
      hours,
      minutes,
      seconds,
    ]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  return [minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function LiveBroadcastTopBar({
  isLive,
  viewers,
  likes,
  onFinishLive,
}: LiveBroadcastTopBarProps) {
  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  useEffect(() => {
    if (!isLive) {
      setElapsedSeconds(0);
      return;
    }

    const startedAt = Date.now();

    const updateElapsed = () => {
      setElapsedSeconds(
        Math.floor(
          (Date.now() - startedAt) / 1000,
        ),
      );
    };

    updateElapsed();

    const intervalId = window.setInterval(
      updateElapsed,
      1000,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isLive]);

  if (!isLive) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={styles.wrapper}
    >
      <View style={styles.bar}>
        <View style={styles.leftGroup}>
          <View style={styles.livePill}>
            <View style={styles.pulseOuter}>
              <View style={styles.pulseInner} />
            </View>

            <Text style={styles.timer}>
              {formatElapsed(elapsedSeconds)}
            </Text>
          </View>

          <View style={styles.statsPill}>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>
                ◉
              </Text>
              <Text style={styles.statText}>
                {viewers}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Text style={styles.heart}>
                ♥
              </Text>
              <Text style={styles.statText}>
                {likes}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Terminar LIVE"
          onPress={onFinishLive}
          style={({ pressed }) => [
            styles.finishButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.finishText}>
            Terminar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 16,
    left: 14,
    right: 14,
    zIndex: 25,
  },
  bar: {
    minHeight: 54,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "rgba(18,18,18,0.28)",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  livePill: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "rgba(18,18,18,0.70)",
  },
  pulseOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,50,68,0.22)",
  },
  pulseInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3344",
  },
  timer: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  statsPill: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "rgba(18,18,18,0.70)",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statIcon: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  heart: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  statText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  divider: {
    width: 1,
    height: 17,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  finishButton: {
    minHeight: 38,
    paddingHorizontal: 15,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3344",
  },
  finishText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.72,
  },
});
