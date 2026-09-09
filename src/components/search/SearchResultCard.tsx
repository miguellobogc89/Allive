// src/components/search/SearchResultCard.tsx

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  LinearGradient,
} from "expo-linear-gradient";

import type {
  SearchLive,
  SearchUser,
} from "../../api/searchApi";

import {
  colors,
  spacing,
} from "../../styles";

type LiveCardProps = {
  type: "live";
  live: SearchLive;
  onPress?: () => void;
};

type UserCardProps = {
  type: "user";
  user: SearchUser;
  onPress?: () => void;
};

type SearchResultCardProps =
  | LiveCardProps
  | UserCardProps;

function getLiveTitle(
  live: SearchLive,
) {
  if (live.title) {
    return live.title;
  }

  if (live.eventName) {
    return live.eventName;
  }

  return "En directo";
}

function getDisplayName(
  user: SearchUser,
) {
  if (user.displayName) {
    return user.displayName;
  }

  return `@${user.username}`;
}

function formatMetric(
  value: number,
) {
  if (value >= 1_000_000) {
    return `${(
      value / 1_000_000
    ).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(
      value / 1000
    ).toFixed(1)}K`;
  }

  return String(value);
}

function MetricBadge({
  icon,
  value,
}: {
  icon: string;
  value: number;
}) {
  return (
    <View
      style={
        styles.metricBadge
      }
    >
      <Text
        style={
          styles.metricIcon
        }
      >
        {icon}
      </Text>

      <Text
        style={
          styles.metricText
        }
      >
        {formatMetric(value)}
      </Text>
    </View>
  );
}

function LivePlaceholder() {
  return (
    <View
      style={
        styles.placeholder
      }
    >
      <LinearGradient
        colors={[
          colors.surfaceElevated,
          colors.surface,
          colors.cameraBackground,
        ]}
        style={
          StyleSheet.absoluteFill
        }
      />
    </View>
  );
}

function LiveCard({
  live,
  onPress,
}: {
  live: SearchLive;
  onPress?: () => void;
}) {
  const hasThumbnail =
    typeof live.thumbnailUrl ===
      "string" &&
    live.thumbnailUrl.length > 0;

  return (
    <Pressable
      style={styles.liveCard}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={styles.media}
      >
        {hasThumbnail && (
          <Image
            source={{
              uri:
                live.thumbnailUrl as string,
            }}
            resizeMode="cover"
            style={
              StyleSheet.absoluteFill
            }
          />
        )}

        {!hasThumbnail && (
          <LivePlaceholder />
        )}

        <LinearGradient
          colors={[
            "rgba(0,0,0,0.02)",
            "rgba(0,0,0,0.05)",
            "rgba(0,0,0,0.92)",
          ]}
          locations={[
            0,
            0.5,
            1,
          ]}
          style={
            StyleSheet.absoluteFill
          }
          pointerEvents="none"
        />

        <View
          style={
            styles.metricsRow
          }
        >
          <MetricBadge
            icon="♥"
            value={
              live.likeCount
            }
          />

          <MetricBadge
            icon="◉"
            value={
              live.viewerCount
            }
          />
        </View>

        <View
          style={
            styles.liveInformation
          }
        >
          {live.placeName && (
            <Text
              style={
                styles.location
              }
              numberOfLines={1}
            >
              {live.placeName}
            </Text>
          )}

          <Text
            style={
              styles.liveTitle
            }
            numberOfLines={2}
          >
            {getLiveTitle(
              live,
            )}
          </Text>

          <View
            style={
              styles.creatorRow
            }
          >
            {live.creator
              .avatarUrl && (
              <Image
                source={{
                  uri:
                    live.creator
                      .avatarUrl,
                }}
                style={
                  styles.avatar
                }
              />
            )}

            {!live.creator
              .avatarUrl && (
              <View
                style={[
                  styles.avatar,
                  styles.avatarFallback,
                ]}
              >
                <Text
                  style={
                    styles.avatarFallbackText
                  }
                >
                  {live.creator.username
                    .slice(0, 1)
                    .toUpperCase()}
                </Text>
              </View>
            )}

            <Text
              style={
                styles.username
              }
              numberOfLines={1}
            >
              @{live.creator.username}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function UserCard({
  user,
  onPress,
}: {
  user: SearchUser;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={styles.userCard}
      onPress={onPress}
      disabled={!onPress}
    >
      {user.avatarUrl && (
        <Image
          source={{
            uri: user.avatarUrl,
          }}
          style={
            styles.userAvatar
          }
        />
      )}

      {!user.avatarUrl && (
        <View
          style={[
            styles.userAvatar,
            styles.userAvatarFallback,
          ]}
        >
          <Text
            style={
              styles.userInitial
            }
          >
            {user.username
              .slice(0, 1)
              .toUpperCase()}
          </Text>
        </View>
      )}

      <View
        style={
          styles.userInformation
        }
      >
        <Text
          style={
            styles.userDisplayName
          }
          numberOfLines={1}
        >
          {getDisplayName(
            user,
          )}
        </Text>

        <Text
          style={
            styles.userHandle
          }
          numberOfLines={1}
        >
          @{user.username}
        </Text>
      </View>
    </Pressable>
  );
}

export function SearchResultCard(
  props: SearchResultCardProps,
) {
  if (props.type === "live") {
    return (
      <LiveCard
        live={props.live}
        onPress={
          props.onPress
        }
      />
    );
  }

  return (
    <UserCard
      user={props.user}
      onPress={
        props.onPress
      }
    />
  );
}

const styles =
  StyleSheet.create({
    liveCard: {
      width: "100%",
      aspectRatio: 9 / 14,
      backgroundColor:
        colors.surface,
    },

    media: {
      flex: 1,
      overflow: "hidden",
      backgroundColor:
        colors.surface,
    },

    placeholder: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor:
        colors.surface,
    },

    metricsRow: {
      position: "absolute",
      top: 10,
      left: 9,
      right: 9,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    metricBadge: {
      minHeight: 26,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor:
        "rgba(0,0,0,0.58)",
    },

    metricIcon: {
      color: colors.text,
      fontSize: 12,
      lineHeight: 14,
      fontWeight: "800",
    },

    metricText: {
      color: colors.text,
      fontSize: 11,
      lineHeight: 14,
      fontWeight: "800",
    },

    liveInformation: {
      position: "absolute",
      left: 11,
      right: 11,
      bottom: 12,
    },

    location: {
      color:
        colors
          .textOnOverlaySecondary,
      fontSize: 10,
      lineHeight: 13,
      fontWeight: "800",
      marginBottom: 4,
      textTransform:
        "uppercase",
      letterSpacing: 0.5,
    },

    liveTitle: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 18,
      fontWeight: "800",
    },

    creatorRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      marginTop: 9,
    },

    avatar: {
      width: 22,
      height: 22,
      borderRadius: 11,
    },

    avatarFallback: {
      backgroundColor:
        colors.surfaceElevated,
      justifyContent:
        "center",
      alignItems: "center",
    },

    avatarFallbackText: {
      color: colors.text,
      fontSize: 10,
      fontWeight: "800",
    },

    username: {
      flexShrink: 1,
      color:
        colors.textOnOverlay,
      fontSize: 11,
      lineHeight: 14,
      fontWeight: "700",
    },

    userCard: {
      width: "100%",
      minHeight: 78,
      backgroundColor:
        colors.surface,
      padding: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },

    userAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },

    userAvatarFallback: {
      backgroundColor:
        colors.surfaceElevated,
      justifyContent:
        "center",
      alignItems: "center",
    },

    userInitial: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "800",
    },

    userInformation: {
      flex: 1,
    },

    userDisplayName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
    },

    userHandle: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 3,
    },
  });