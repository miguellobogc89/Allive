// src/components/live/viewer/header/LiveViewerIdentity.tsx

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
} from "../../../../styles";

import type {
  ActiveLive,
} from "../../types";

type Props = {
  live: ActiveLive;
  followLoading?: boolean;
  isFollowing?: boolean;
  onFollowPress?: () => void;
  onOpenCreator?: () => void;
};

export function LiveViewerIdentity({
  live,
  followLoading = false,
  isFollowing = false,
  onFollowPress,
  onOpenCreator,
}: Props) {
  const creator = live.creator ?? null;

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

  const event =
    live.eventName?.trim() || null;

  const title =
    live.title?.trim() || null;

  return (
    <View style={styles.container}>
      {event ? (
        <Text
          numberOfLines={2}
          style={styles.event}
        >
          {event}
        </Text>
      ) : null}

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
          <View style={styles.avatarShadow}>
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
                <Text style={styles.avatarFallback}>
                  {creatorInitial}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.creatorInfo}>
            <View style={styles.nameRow}>
              <Text
                numberOfLines={1}
                style={styles.creatorName}
              >
                {creatorName}
              </Text>

              {onFollowPress ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    isFollowing
                      ? "Dejar de seguir creador"
                      : "Seguir creador"
                  }
                  disabled={followLoading}
                  onPress={(event) => {
                    event.stopPropagation();
                    onFollowPress();
                  }}
                  style={({ pressed }) => [
                    styles.followButton,
                    isFollowing &&
                      styles.followingButton,
                    followLoading &&
                      styles.followDisabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.followText}>
                    {followLoading
                      ? "..."
                      : isFollowing
                        ? "Siguiendo"
                        : "Seguir"}
                  </Text>
                </Pressable>
              ) : null}
            </View>

            {location ? (
              <Text
                numberOfLines={1}
                style={styles.location}
              >
                {location}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </View>

      {title ? (
        <Text
          numberOfLines={2}
          style={styles.title}
        >
          {title}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  event: {
    marginBottom: 10,

    color: "#FFFFFF",

    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",

    letterSpacing: -0.7,

    textShadowColor: "rgba(0,0,0,0.95)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },

  creatorRow: {
    width: "100%",
  },

  creatorIdentity: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarShadow: {
    width: 56,
    height: 56,
    borderRadius: 28,

    marginRight: 12,

    backgroundColor: "#000000",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3,

    elevation: 12,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,

    overflow: "hidden",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.surfaceElevated,

    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.9)",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarFallback: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  creatorInfo: {
    flex: 1,
    minWidth: 0,

    height: 56,

    justifyContent: "center",
    gap: 5,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  creatorName: {
    flexShrink: 1,

    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "600",

    textShadowColor: "rgba(0,0,0,0.95)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  followButton: {
    height: 27,

    paddingHorizontal: 12,

    borderRadius: 6,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(45,45,45,0.92)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  followingButton: {
    backgroundColor: "rgba(65,65,65,0.9)",
  },

  followDisabled: {
    opacity: 0.55,
  },

  followText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  location: {
    color: "rgba(255,255,255,0.78)",

    fontSize: 13,
    fontWeight: "500",

    textShadowColor: "rgba(0,0,0,0.95)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  title: {
    marginTop: 9,

    color: "rgba(255,255,255,0.94)",

    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",

    textShadowColor: "rgba(0,0,0,0.95)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  pressed: {
    opacity: 0.72,
  },
});