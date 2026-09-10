import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  followUser,
  getUserProfile,
  unfollowUser,
  type OtherUserProfile,
} from "../api/userProfileApi";
import { useAuth } from "../auth/AuthContext";
import { ProfilePublicActions } from "../components/profile/ProfilePublicActions";

type Props = {
  userId: string;
  onBack: () => void;
};

export function UserProfileScreen({
  userId,
  onBack,
}: Props) {
  const { token } = useAuth();

  const [
    profile,
    setProfile,
  ] =
    useState<OtherUserProfile | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [
    followLoading,
    setFollowLoading,
  ] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const controller =
      new AbortController();

    setLoading(true);

    getUserProfile(
      userId,
      token,
      controller.signal,
    )
      .then(setProfile)
      .catch(console.error)
      .finally(() => {
        if (
          !controller.signal
            .aborted
        ) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [
    userId,
    token,
  ]);

  const videos =
    useMemo(
      () => profile?.lives ?? [],
      [profile],
    );

  async function toggleFollow() {
    if (
      !token ||
      !profile ||
      followLoading
    ) {
      return;
    }

    setFollowLoading(true);

    try {
      const result =
        profile.isFollowing
          ? await unfollowUser(
              userId,
              token,
            )
          : await followUser(
              userId,
              token,
            );

      setProfile((current) =>
        current
          ? {
              ...current,
              isFollowing:
                result.isFollowing,
              stats: {
                ...current.stats,
                followers:
                  result.followers,
              },
            }
          : current,
      );
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.state}>
        <ActivityIndicator color="#111111" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.state}>
        <Text>
          No se pudo cargar el perfil.
        </Text>
      </View>
    );
  }

  const displayName =
    profile.user.displayName ||
    profile.user.username;

  const avatarLetter =
    displayName
      .trim()
      .charAt(0)
      .toUpperCase() || "?";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.top}>
          <Pressable
            onPress={onBack}
            hitSlop={10}
            style={styles.icon}
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color="#171717"
            />
          </Pressable>

          <Text style={styles.username}>
            {profile.user.username}
          </Text>

          <View style={styles.icon} />
        </View>

        <View style={styles.identity}>
          {profile.user.avatarUrl ? (
            <Image
              source={{
                uri: profile.user.avatarUrl,
              }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {avatarLetter}
              </Text>
            </View>
          )}

          <Text style={styles.displayName}>
            {displayName}
          </Text>

          <Text style={styles.handle}>
            @{profile.user.username}
          </Text>
        </View>

        <ProfilePublicActions
          isFollowing={
            profile.isFollowing
          }
          loading={followLoading}
          onFollow={() => {
            void toggleFollow();
          }}
          onSubscribe={() => {}}
        />

        <View style={styles.stats}>
          <Text style={styles.stat}>
            {profile.stats.followers} seguidores
          </Text>
          <Text style={styles.stat}>
            {profile.stats.following} siguiendo
          </Text>
          <Text style={styles.stat}>
            {profile.stats.emissions} emisiones
          </Text>
        </View>

        <View style={styles.gallery}>
          {videos.map((video) => (
            <View
              key={video.id}
              style={styles.videoCard}
            >
              {video.thumbnailUrl ? (
                <Image
                  source={{
                    uri: video.thumbnailUrl,
                  }}
                  style={styles.thumbnail}
                />
              ) : (
                <View style={styles.thumbnail}>
                  <Ionicons
                    name="videocam"
                    size={22}
                    color="#888888"
                  />
                </View>
              )}

              <Text
                style={styles.videoTitle}
                numberOfLines={1}
              >
                {video.title ||
                  "LIVE sin titulo"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },

    content: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 130,
    },

    top: {
      minHeight: 46,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    icon: {
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent:
        "center",
    },

    username: {
      flex: 1,
      textAlign: "center",
      color: "#151515",
      fontSize: 19,
      fontWeight: "600",
    },

    identity: {
      marginTop: 12,
      alignItems: "center",
    },

    avatar: {
      width: 92,
      height: 92,
      borderRadius: 46,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor: "#EFEFEF",
    },

    avatarText: {
      color: "#262626",
      fontSize: 32,
      fontWeight: "800",
    },

    displayName: {
      marginTop: 12,
      color: "#111111",
      fontSize: 20,
      fontWeight: "800",
    },

    handle: {
      marginTop: 3,
      color: "#737373",
      fontSize: 14,
      fontWeight: "500",
    },

    stats: {
      marginTop: 18,
      flexDirection: "row",
      justifyContent:
        "space-between",
    },

    stat: {
      color: "#444444",
      fontSize: 12,
      fontWeight: "700",
    },

    gallery: {
      marginTop: 24,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    videoCard: {
      width: "31%",
      minWidth: 96,
    },

    thumbnail: {
      width: "100%",
      aspectRatio: 9 / 12,
      borderRadius: 8,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor: "#EFEFEF",
    },

    videoTitle: {
      marginTop: 6,
      color: "#171717",
      fontSize: 12,
      fontWeight: "700",
    },

    state: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor: "#FFFFFF",
    },
  });
