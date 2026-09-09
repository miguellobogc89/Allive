// src/components/live/LiveBroadcastHeader.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { Animated } from "react-native";
import {
  Animated as RNAnimated,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  controls,
  iconSizes,
  radius,
  spacing,
  typography,
} from "../../styles";

import type {
  LiveAudience,
} from "./liveAudience";

import {
  LiveViewerAudience,
} from "./LiveViewerAudience";

type Props = {
  isLive: boolean;
  viewers: number;
  likes?: number;
  audience: LiveAudience;
  viewerDelta: number | null;
  badgeScale: Animated.AnimatedInterpolation<string | number>;
  deltaOpacity: Animated.AnimatedInterpolation<string | number>;
  deltaTranslateY: Animated.AnimatedInterpolation<string | number>;
};

export function LiveBroadcastHeader({
  isLive,
  viewers,
  likes = 0,
  audience,
  viewerDelta,
  badgeScale,
  deltaOpacity,
  deltaTranslateY,
}: Props) {
  const viewerTotal =
    Math.max(
      viewers,
      audience.total,
    );

  const [audienceOpen, setAudienceOpen] =
    useState(false);

  const likePulse =
    useRef(
      new RNAnimated.Value(0),
    ).current;

  const previousLikes =
    useRef(likes);

  useEffect(() => {
    if (likes === previousLikes.current) {
      return;
    }

    previousLikes.current = likes;

    likePulse.stopAnimation();
    likePulse.setValue(0);

    RNAnimated.sequence([
      RNAnimated.spring(
        likePulse,
        {
          toValue: 1,
          friction: 5,
          tension: 170,
          useNativeDriver: false,
        },
      ),
      RNAnimated.timing(
        likePulse,
        {
          toValue: 0,
          duration: 260,
          useNativeDriver: false,
        },
      ),
    ]).start();
  }, [likes, likePulse]);

  const likeScale =
    likePulse.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.22],
    });

  return (
    <View style={styles.container}>
      <View style={styles.leftCluster}>
        <View
          style={[
            styles.status,
            isLive &&
              styles.liveStatus,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isLive &&
                styles.liveDot,
            ]}
          />

          <Text
            style={styles.statusText}
          >
            {isLive ? "LIVE" : "LISTO"}
          </Text>
        </View>

        <LiveViewerAudience
          audience={audience}
          open={audienceOpen}
          onToggle={() =>
            setAudienceOpen(
              (value) => !value,
            )
          }
        />
      </View>

      <View style={styles.rightCluster}>
        <RNAnimated.View
          style={[
            styles.metric,
            {
              transform: [
                {
                  scale: likeScale,
                },
              ],
            },
          ]}
        >
          <Ionicons
            name="heart"
            size={iconSizes.sm}
            color={colors.live}
          />

          <Text
            style={styles.metricText}
          >
            {likes}
          </Text>
        </RNAnimated.View>

        <View style={styles.viewerWrapper}>
          <RNAnimated.View
            style={[
              styles.metric,
              {
                transform: [
                  {
                    scale:
                      badgeScale,
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="eye-outline"
              size={iconSizes.sm}
              color={colors.text}
            />

            <Text
              style={
                styles.metricText
              }
            >
              {viewerTotal}
            </Text>
          </RNAnimated.View>

          {viewerDelta !== null ? (
            <RNAnimated.Text
              style={[
                styles.delta,
                {
                  opacity:
                    deltaOpacity,
                  transform: [
                    {
                      translateY:
                        deltaTranslateY,
                    },
                  ],
                },
              ]}
            >
              {viewerDelta > 0
                ? `+${viewerDelta}`
                : viewerDelta}
            </RNAnimated.Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 22,
    left: 16,
    right: 16,
    zIndex: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  leftCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  rightCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  metric: {
    minWidth: 54,
    height:
      controls.compactBadgeHeight,
    paddingHorizontal: 11,
    borderRadius:
      radius.round,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor:
      colors.overlayChrome,
    borderWidth:
      StyleSheet.hairlineWidth,
    borderColor:
      colors.dividerOnOverlay,
  },

  metricText: {
    color: colors.text,
    ...typography.label,
  },

  status: {
    height:
      controls.compactBadgeHeight,
    paddingHorizontal: 11,
    borderRadius:
      radius.round,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor:
      colors.overlayChrome,
    borderWidth:
      StyleSheet.hairlineWidth,
    borderColor:
      colors.dividerOnOverlay,
  },

  liveStatus: {
    backgroundColor:
      colors.live,
    borderColor:
      colors.live,
  },

  statusDot: {
    width:
      controls.badgeDotSize,
    height:
      controls.badgeDotSize,
    borderRadius:
      controls.badgeDotSize / 2,
    backgroundColor:
      colors.textOnOverlayMuted,
  },

  liveDot: {
    backgroundColor:
      colors.text,
  },

  statusText: {
    color: colors.text,
    ...typography.caption,
    fontWeight: "900",
  },

  viewerWrapper: {
    position: "relative",
    alignItems: "center",
  },

  delta: {
    position: "absolute",
    top: 42,
    color: colors.text,
    ...typography.caption,
    fontWeight: "900",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.md,
    backgroundColor:
      colors.overlayDelta,
  },
});
