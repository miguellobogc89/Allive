// src/components/live/LiveBroadcastHeader.tsx

import { Ionicons } from "@expo/vector-icons";
import type { Animated } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Animated as RNAnimated } from "react-native";

import { colors, radius, spacing, typography } from "../../styles";

type LiveBroadcastHeaderProps = {
  isLive: boolean;
  viewers: number;
  viewerDelta: number | null;
  badgeScale: Animated.AnimatedInterpolation<string | number>;
  deltaOpacity: Animated.AnimatedInterpolation<string | number>;
  deltaTranslateY: Animated.AnimatedInterpolation<string | number>;
};

export function LiveBroadcastHeader({
  isLive,
  viewers,
  viewerDelta,
  badgeScale,
  deltaOpacity,
  deltaTranslateY,
}: LiveBroadcastHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.circleButton}>
        <Ionicons name="close" size={25} color={colors.text} />
      </Pressable>

      <View style={[styles.statusBadge, isLive && styles.liveBadge]}>
        <View style={[styles.statusDot, isLive && styles.liveDot]} />
        <Text style={styles.statusText}>{isLive ? "LIVE" : "LISTO"}</Text>
      </View>

      <View style={styles.viewerBadgeWrapper}>
        <RNAnimated.View
          style={[
            styles.viewerBadge,
            {
              transform: [{ scale: badgeScale }],
            },
          ]}
        >
          <Ionicons name="eye-outline" size={16} color={colors.text} />
          <Text style={styles.viewerText}>{viewers}</Text>
        </RNAnimated.View>

        {viewerDelta !== null ? (
          <RNAnimated.Text
            style={[
              styles.viewerDelta,
              {
                opacity: deltaOpacity,
                transform: [{ translateY: deltaTranslateY }],
              },
            ]}
          >
            {viewerDelta > 0 ? `+${viewerDelta}` : viewerDelta}
          </RNAnimated.Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 18,
    left: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 20,
  },
  circleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  statusBadge: {
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  liveBadge: {
    backgroundColor: "rgba(255,59,48,0.88)",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  liveDot: {
    backgroundColor: colors.text,
  },
  statusText: {
    color: colors.text,
    fontSize: typography.caption.fontSize,
    fontWeight: "900",
  },
  viewerBadgeWrapper: {
    position: "relative",
    alignItems: "center",
  },
  viewerBadge: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.round,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  viewerText: {
    color: colors.text,
    ...typography.label,
  },
  viewerDelta: {
    position: "absolute",
    top: 44,
    color: colors.text,
    fontSize: typography.caption.fontSize,
    fontWeight: "900",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: "rgba(0,0,0,0.72)",
  },
});
