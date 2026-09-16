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
    creator?.displayName ||
    creator?.username ||
    "Allive";

  const creatorInitial =
    creatorName
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "A";

  const location =
    live.placeName?.trim() ||
    null;

  const eventName =
    live.eventName?.trim() ||
    live.title?.trim() ||
    null;

  return (
    <View
      style={styles.container}
    >
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
            {creatorName}
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

      {location ? (
        <View
          style={
            styles.locationRow
          }
        >
          <Ionicons
            name="location-sharp"
            size={13}
            color="rgba(255,255,255,0.78)"
          />

          <Text
            numberOfLines={1}
            style={
              styles.location
            }
          >
            {location}
          </Text>
        </View>
      ) : null}

      {eventName ? (
        <Text
          numberOfLines={2}
          style={styles.event}
        >
          {eventName}
        </Text>
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",

      maxWidth: 430,
    },

    creatorRow: {
      width: "100%",

      flexDirection: "row",
      alignItems: "center",
    },

    creatorIdentity: {
      flex: 1,

      minWidth: 0,

      flexDirection: "row",
      alignItems: "center",
    },

    avatar: {
      width: 38,
      height: 38,

      marginRight: 9,

      borderRadius: 19,

      overflow: "hidden",

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        colors.surfaceElevated,

      borderWidth: 1.5,

      borderColor:
        "rgba(255,255,255,0.92)",

      shadowColor:
        "#000000",

      shadowOffset: {
        width: 0,
        height: 1,
      },

      shadowOpacity: 0.35,
      shadowRadius: 3,

      elevation: 5,
    },

    avatarImage: {
      width: "100%",
      height: "100%",
    },

    avatarFallback: {
      color: "#FFFFFF",

      fontSize: 14,
      fontWeight: "700",
    },

    creatorName: {
      flexShrink: 1,

      color: "#FFFFFF",

      fontSize: 14,
      fontWeight: "700",

      textShadowColor:
        "rgba(0,0,0,0.8)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 3,
    },

    followButton: {
      minWidth: 62,
      height: 29,

      marginLeft: 10,

      paddingHorizontal: 13,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 15,

      backgroundColor:
        "rgba(255,255,255,0.16)",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.28)",
    },

    followingButton: {
      backgroundColor:
        "rgba(255,255,255,0.10)",
    },

    followDisabled: {
      opacity: 0.5,
    },

    followText: {
      color: "#FFFFFF",

      fontSize: 11,
      fontWeight: "700",
    },

    locationRow: {
      marginTop: 7,

      flexDirection: "row",
      alignItems: "center",

      gap: 4,
    },

    location: {
      flexShrink: 1,

      color:
        "rgba(255,255,255,0.78)",

      fontSize: 12,
      fontWeight: "500",

      textShadowColor:
        "rgba(0,0,0,0.8)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 3,
    },

event: {
  marginTop: 4,

  color: "#FFFFFF",

  fontSize: 17,
  lineHeight: 21,

  fontWeight: "700",

  letterSpacing: -0.2,

  textShadowColor:
    "rgba(0,0,0,0.9)",

  textShadowOffset: {
    width: 0,
    height: 1,
  },

  textShadowRadius: 4,
},

    pressed: {
      opacity: 0.72,
    },
  });