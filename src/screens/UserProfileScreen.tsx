// src/screens/UserProfileScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
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
import {
  ProfileHero,
  ProfileHighlightsSection,
  ProfileLatestLiveSection,
  type ProfileVideoItem,
} from "../components/profile";

type Props = {
  userId: string;
  onBack: () => void;
};

function formatCount(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return String(value);
}

function mapLive(
  live: OtherUserProfile["lives"][number],
): ProfileVideoItem {
  return {
    id: live.id,
    title: live.title || "LIVE sin titulo",
    placeName:
      live.placeName || "Sin ubicacion",
    startedAt: live.startedAt,
    endedAt: live.endedAt,
    thumbnailUrl: live.thumbnailUrl,
  };
}

function PublicStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value}
      </Text>
      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

export function UserProfileScreen({
  userId,
  onBack,
}: Props) {
  const { token, user } = useAuth();

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
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    followLoading,
    setFollowLoading,
  ] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError(
        "Necesitas iniciar sesion para ver este perfil.",
      );
      return;
    }

    const controller =
      new AbortController();

    setLoading(true);
    setError(null);

    getUserProfile(
      userId,
      token,
      controller.signal,
    )
      .then(setProfile)
      .catch((caughtError) => {
        if (
          caughtError instanceof Error &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        console.error(caughtError);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "No se pudo cargar el perfil.",
        );
      })
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
      () =>
        profile?.lives.map(mapLive) ??
        [],
      [profile],
    );

  async function toggleFollow() {
    if (
      !token ||
      !profile ||
      followLoading ||
      user?.id === profile.user.id
    ) {
      return;
    }

    const previous =
      profile.isFollowing;

    setFollowLoading(true);

    setProfile((current) =>
      current
        ? {
            ...current,
            isFollowing: !previous,
          }
        : current,
    );

    try {
      const result = previous
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
    } catch (caughtError) {
      console.error(caughtError);

      setProfile((current) =>
        current
          ? {
              ...current,
              isFollowing: previous,
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
        <ActivityIndicator color="#38AFFF" />
      </View>
    );
  }

  if (!profile || error) {
    return (
      <View style={styles.state}>
        <Pressable
          onPress={onBack}
          hitSlop={10}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color="#FFFFFF"
          />
        </Pressable>

        <Text style={styles.stateText}>
          {error || "No se pudo cargar el perfil."}
        </Text>
      </View>
    );
  }

  const displayName =
    profile.user.displayName ||
    profile.user.username;
  const isOwnProfile =
    user?.id === profile.user.id;

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
        <View style={styles.topBar}>
          <Pressable
            onPress={onBack}
            hitSlop={10}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={27}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <ProfileHero
          displayName={displayName}
          username={profile.user.username}
          coverUrl={profile.user.avatarUrl}
          description=""
          location=""
          action={
            isOwnProfile ? null : (
              <Pressable
                disabled={followLoading}
                onPress={() => {
                  void toggleFollow();
                }}
                style={({ pressed }) => [
                  styles.followButton,
                  profile.isFollowing &&
                    styles.followingButton,
                  followLoading &&
                    styles.followLoading,
                  pressed &&
                    styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.followText,
                    profile.isFollowing &&
                      styles.followingText,
                  ]}
                >
                  {followLoading
                    ? "..."
                    : profile.isFollowing
                      ? "Siguiendo"
                      : "Seguir"}
                </Text>
              </Pressable>
            )
          }
        />

        <View style={styles.statsRow}>
          <PublicStat
            value={formatCount(
              profile.stats.followers,
            )}
            label="Seguidores"
          />
          <PublicStat
            value={formatCount(
              profile.stats.following,
            )}
            label="Siguiendo"
          />
          <PublicStat
            value={formatCount(
              profile.stats.emissions,
            )}
            label="Emisiones"
          />
        </View>

        <ProfileLatestLiveSection
          video={videos[0]}
          title="Ultimo directo"
        />

        <ProfileHighlightsSection
          videos={videos.slice(1)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06101A",
  },

  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 140,
    backgroundColor: "#06101A",
  },

  topBar: {
    position: "relative",
    zIndex: 20,
    minHeight: 52,
    justifyContent: "center",
  },

  iconButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  followButton: {
    minWidth: 108,
    height: 36,
    paddingHorizontal: 17,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  followingButton: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    backgroundColor:
      "rgba(4,14,24,0.46)",
  },

  followLoading: {
    opacity: 0.62,
  },

  followText: {
    color: "#06101A",
    fontSize: 12,
    fontWeight: "700",
  },

  followingText: {
    color: "#FFFFFF",
  },

  statsRow: {
    flexDirection: "row",
    gap: 7,
    marginTop: 14,
  },

  statCard: {
    flex: 1,
    minHeight: 58,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    justifyContent: "center",
    backgroundColor:
      "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  statLabel: {
    marginTop: 3,
    color: "#A8B5C5",
    fontSize: 10,
    fontWeight: "500",
  },

  pressed: {
    opacity: 0.72,
  },

  state: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#06101A",
    paddingHorizontal: 24,
  },

  stateText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 18,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
});
