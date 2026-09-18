// src/components/live/viewer/header/LiveViewerIdentity.tsx

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

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
  const creator =
    live.creator ?? null;

  const creatorName =
    creator?.username ||
    creator?.displayName ||
    "Allive";

  const creatorInitial =
    creatorName
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "A";

const eventName =
  live.eventName?.trim() ||
  null;

const title =
  live.title?.trim() ||
  null;

  const location =
    live.placeName?.trim() ||
    null;

  return (
    <View
      style={styles.container}
    >
      {eventName ? (
        <Text
          numberOfLines={2}
          style={styles.event}
        >
          {eventName}
        </Text>
      ) : null}

{title ? (
  <Text
    numberOfLines={2}
    style={styles.title}
  >
    {title}
  </Text>
) : null}

      {location ? (
        <View
          style={styles.locationRow}
        >
          <Ionicons
            name="location-sharp"
            size={13}
            color="rgba(255,255,255,0.78)"
          />

          <Text
            numberOfLines={1}
            style={styles.location}
          >
            {location}
          </Text>
        </View>
      ) : null}

      <View
        style={styles.creatorRow}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil del creador"
          disabled={
            !onOpenCreator
          }
          onPress={
            onOpenCreator
          }
          style={({
            pressed,
          }) => [
            styles.creatorIdentity,

            pressed &&
              styles.pressed,
          ]}
        >
          <View
            style={styles.avatar}
          >
            {creator?.avatarUrl ? (
              <Image
                source={{
                  uri:
                    creator.avatarUrl,
                }}
                style={
                  styles.avatarImage
                }
                resizeMode="cover"
              />
            ) : (
              <Text
                style={
                  styles.avatarFallback
                }
              >
                {creatorInitial}
              </Text>
            )}
          </View>

          <Text
            numberOfLines={1}
            style={
              styles.creatorName
            }
          >
            @{creatorName}
          </Text>
        </Pressable>

        {onFollowPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isFollowing
                ? "Dejar de seguir creador"
                : "Seguir creador"
            }
            disabled={
              followLoading
            }
            onPress={
              onFollowPress
            }
            style={({
              pressed,
            }) => [
              styles.followButton,

              isFollowing &&
                styles.followingButton,

              followLoading &&
                styles.followDisabled,

              pressed &&
                styles.pressed,
            ]}
          >
            <Text
              style={
                styles.followText
              }
            >
              {followLoading
                ? "..."
                : isFollowing
                  ? "Siguiendo"
                  : "Seguir"}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
      maxWidth: "100%",
      justifyContent: "flex-end",
    },

    event: {
      color: "#FFFFFF",

      fontSize: 18,
      lineHeight: 22,

      fontWeight: "700",

      letterSpacing: -0.3,

      textShadowColor:
        "rgba(0,0,0,0.9)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 4,
    },

title: {
  marginTop: 3,

  color: "#FFFFFF",

  fontSize: 15,
  lineHeight: 19,

  fontWeight: "500",

  textShadowColor:
    "rgba(0,0,0,0.9)",

  textShadowOffset: {
    width: 0,
    height: 1,
  },

  textShadowRadius: 3,
},

    locationRow: {
      marginTop: 4,

      flexDirection: "row",
      alignItems: "center",

      gap: 3,
    },

    location: {
      flexShrink: 1,

      color:
        "rgba(255,255,255,0.78)",

      fontSize: 12,
      lineHeight: 16,

      fontWeight: "500",

      textShadowColor:
        "rgba(0,0,0,0.9)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 3,
    },

    creatorRow: {
      marginTop: 10,

      flexDirection: "row",
      alignItems: "center",
    },

    creatorIdentity: {
      flexDirection: "row",
      alignItems: "center",

      minWidth: 0,
    },

    avatar: {
      width: 28,
      height: 28,

      marginRight: 7,

      borderRadius: 14,

      overflow: "hidden",

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        colors.surfaceElevated,

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.7)",
    },

    avatarImage: {
      width: "100%",
      height: "100%",
    },

    avatarFallback: {
      color: "#FFFFFF",

      fontSize: 12,
      fontWeight: "700",
    },

    creatorName: {
      flexShrink: 1,

      color: "#FFFFFF",

      fontSize: 13,
      fontWeight: "600",

      textShadowColor:
        "rgba(0,0,0,0.9)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 3,
    },

    followButton: {
      height: 27,

      marginLeft: 10,

      paddingHorizontal: 13,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 7,

      backgroundColor:
        "rgba(0,0,0,0.18)",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.72)",
    },

    followingButton: {
      backgroundColor:
        "rgba(255,255,255,0.12)",
    },

    followDisabled: {
      opacity: 0.5,
    },

    followText: {
      color: "#FFFFFF",

      fontSize: 11,
      fontWeight: "600",
    },

    pressed: {
      opacity: 0.72,
    },
  });