// src/components/live/LiveViewerHeader.tsx

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  controls,
  spacing,
  typography,
} from "../../styles";

import {
  LiveViewerAudience,
} from "./LiveViewerAudience";

import type {
  LiveAudience,
} from "./liveAudience";

import type {
  ActiveLive,
} from "./types";

type Props = {
  live: ActiveLive;
  audience: LiveAudience;
  audienceOpen: boolean;
  followLoading?: boolean;
  isFollowing?: boolean;
  onFollowPress?: () => void;
  onOpenCreator?: () => void;
  onAudienceToggle: () => void;
};

export function LiveViewerHeader({
  live,
  audience,
  audienceOpen,
  followLoading = false,
  isFollowing = false,
  onFollowPress,
  onOpenCreator,
  onAudienceToggle,
}: Props) {
  const creator =
    live.creator ?? null;
  const creatorName =
    creator?.displayName ||
    creator?.username ||
    "Allive";
  const creatorInitial =
    creatorName
      .trim()
      .charAt(0)
      .toUpperCase() || "A";
  const location =
    live.placeName?.trim() || null;
  const title =
    live.title?.trim() || null;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View
          style={styles.liveBadge}
          pointerEvents="none"
        >
          <View
            style={styles.liveDot}
          />

          <Text
            style={styles.liveText}
          >
            LIVE
          </Text>
        </View>

        <LiveViewerAudience
          audience={audience}
          open={audienceOpen}
          onToggle={
            onAudienceToggle
          }
        />
      </View>

      <View style={styles.creatorRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil del creador"
          disabled={!onOpenCreator}
          onPress={onOpenCreator}
          style={({ pressed }) => [
            styles.creatorIdentity,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.avatar}>
            {creator?.avatarUrl ? (
              <Image
                source={{
                  uri: creator.avatarUrl,
                }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarText}>
                {creatorInitial}
              </Text>
            )}
          </View>

          <Text
            numberOfLines={1}
            style={styles.creatorName}
          >
            {creatorName}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isFollowing
              ? "Dejar de seguir creador"
              : "Seguir creador"
          }
          disabled={
            followLoading || !onFollowPress
          }
          onPress={onFollowPress}
          style={({ pressed }) => [
            styles.followButton,
            isFollowing &&
              styles.followingButton,
            (!onFollowPress ||
              followLoading) &&
              styles.followButtonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.followText,
              isFollowing &&
                styles.followingText,
            ]}
          >
            {followLoading
              ? "..."
              : isFollowing
                ? "Siguiendo"
                : "Seguir"}
          </Text>
        </Pressable>
      </View>

      {title || location ? (
        <View style={styles.metadata}>
          {title ? (
            <Text
              numberOfLines={2}
              style={styles.title}
            >
              {title}
            </Text>
          ) : null}

          {location ? (
            <Text
              numberOfLines={1}
              style={styles.location}
            >
              {location}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: "absolute",

      top: 18,

      left: spacing.md,
      right: spacing.md,
      alignItems: "flex-start",
      gap: 8,
      zIndex: 30,
    },

    topRow: {
      flexDirection: "row",

      alignItems: "center",

      gap: spacing.xs,
    },

    liveBadge: {
      height:
        controls.compactBadgeHeight,

      paddingHorizontal: 10,

      borderRadius: 9,

      flexDirection: "row",

      alignItems: "center",

      gap: 6,

      backgroundColor:
        colors.live,
    },

    liveDot: {
      width:
        controls.badgeDotSize,

      height:
        controls.badgeDotSize,

      borderRadius: 4,

      backgroundColor:
        colors.text,
    },

    liveText: {
      color: colors.text,

      fontSize:
        typography.caption
          .fontSize,

      fontWeight: "900",

      letterSpacing: 0.4,
    },

    creatorRow: {
      maxWidth: "78%",
      minHeight: 38,
      paddingRight: 5,
      borderRadius: 19,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor:
        "rgba(20,20,20,0.58)",
    },

    creatorIdentity: {
      minHeight: 38,
      flexShrink: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    avatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        colors.surfaceElevated,
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.26)",
    },

    avatarImage: {
      width: "100%",
      height: "100%",
    },

    avatarText: {
      color: colors.text,
      ...typography.label,
      fontWeight: "800",
    },

    creatorName: {
      maxWidth: 132,
      color: colors.text,
      ...typography.label,
      fontWeight: "700",
    },

    followButton: {
      height: 28,
      paddingHorizontal: 12,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
    },

    followingButton: {
      backgroundColor:
        "rgba(255,255,255,0.16)",
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.28)",
    },

    followButtonDisabled: {
      opacity: 0.62,
    },

    followText: {
      color: "#111111",
      fontSize: 12,
      fontWeight: "800",
    },

    followingText: {
      color: colors.text,
    },

    metadata: {
      maxWidth: "78%",
      gap: 3,
    },

    title: {
      color: colors.text,
      ...typography.title,
      lineHeight: 22,
      textShadowColor:
        colors.overlayChrome,
      textShadowOffset: {
        width: 0,
        height: 1,
      },
      textShadowRadius: 4,
    },

    location: {
      color: colors.textOnOverlay,
      ...typography.label,
      fontWeight: "600",
      textShadowColor:
        colors.overlayChrome,
      textShadowOffset: {
        width: 0,
        height: 1,
      },
      textShadowRadius: 4,
    },

    pressed: {
      opacity: 0.78,
    },
  });
