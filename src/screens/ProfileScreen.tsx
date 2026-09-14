// src/screens/ProfileScreen.tsx

import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  getMyProfileStats,
  type ProfileStatsData,
} from "../api/profileApi";

import {
  ProfileEditPanel,
  ProfileHero,
  ProfileSettingsPanel,
  ProfileTopBar,
} from "../components/profile";

import {
  ProfileMockHighlights,
  ProfileMockLatestLive,
  ProfileMockStats,
} from "../components/profile/mock";

const MOCK_DESCRIPTION =
  "Vivo el presente, grabo lo real. Gente bonita, planes locos y buenas vibras.";

const BOTTOM_NAV_SPACE = 92;

type Props = {
  unreadNotifications?: number;
  onOpenNotifications?: () => void;
};

export function ProfileScreen({
  unreadNotifications = 0,
  onOpenNotifications,
}: Props) {
  const {
    user,
    token,
    updateUsername,
    updateProfile,
    uploadAvatar,
    logout,
  } = useAuth();

  const [
    settingsVisible,
    setSettingsVisible,
  ] = useState(false);

  const [
    editVisible,
    setEditVisible,
  ] = useState(false);

  const [
    highlightsExpanded,
    setHighlightsExpanded,
  ] = useState(false);

  const [
    isSavingUsername,
    setIsSavingUsername,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    stats,
    setStats,
  ] = useState<ProfileStatsData>({
    followers: 0,
    emissions: 0,
    averageViewers: null,
  });

  const username =
    user?.username ||
    "invitado";

  const displayName =
    user?.displayName ||
    user?.username ||
    "Invitado";

  const avatarUrl =
    user?.avatarUrl ?? null;

  useEffect(() => {
    if (!token) {
      setStats({
        followers: 0,
        emissions: 0,
        averageViewers: null,
      });

      return;
    }

    const controller =
      new AbortController();

    async function loadStats() {
      if (!token) {
        return;
      }

      try {
        const nextStats =
          await getMyProfileStats(
            token,
            controller.signal,
          );

        setStats(nextStats);
      } catch (loadError) {
        if (
          loadError instanceof Error &&
          loadError.name ===
            "AbortError"
        ) {
          return;
        }
      }
    }

    void loadStats();

    return () => {
      controller.abort();
    };
  }, [token]);

  async function handleSaveUsername(
    nextUsername: string,
  ) {
    if (!user) {
      setEditVisible(false);
      return;
    }

    const normalized =
      nextUsername
        .trim()
        .toLowerCase();

    if (!normalized) {
      setEditVisible(false);
      setError(null);
      return;
    }

    if (
      normalized ===
      user.username
    ) {
      setEditVisible(false);
      setError(null);
      return;
    }

    try {
      setIsSavingUsername(true);
      setError(null);

      await updateUsername(
        normalized,
      );

      setEditVisible(false);
    } catch (saveError) {
      if (
        saveError instanceof Error
      ) {
        setError(
          saveError.message,
        );
      } else {
        setError(
          "No se pudo actualizar el perfil",
        );
      }
    } finally {
      setIsSavingUsername(false);
    }
  }

  async function handleUploadAvatar(
    image: Blob,
  ) {
    const updatedUser =
      await uploadAvatar(
        image,
      );

    return updatedUser.avatarUrl;
  }

  async function handleSaveProfile(
    value: {
      displayName: string;
      avatarUrl: string | null;
    },
  ) {
    await updateProfile(value);
  }

  function openEditProfile() {
    setSettingsVisible(false);
    setError(null);
    setEditVisible(true);
  }

  function handleToggleHighlights() {
    setHighlightsExpanded(
      !highlightsExpanded,
    );
  }

let liveAreaStyle:
  | typeof styles.liveArea
  | typeof styles.liveAreaExpanded =
  styles.liveArea;

let highlightsStyle:
  | typeof styles.highlightsFooter
  | typeof styles.highlightsExpanded =
  styles.highlightsFooter;

if (highlightsExpanded) {
  liveAreaStyle =
    styles.liveAreaExpanded;

  highlightsStyle =
    styles.highlightsExpanded;
}

  const profileContent = (
    <>
      <ProfileTopBar
        username={username}
        unreadNotifications={
          unreadNotifications
        }
        onPressNotifications={
          onOpenNotifications
        }
        onPressSettings={() => {
          setSettingsVisible(
            true,
          );
        }}
      />

      <ProfileHero
        displayName={
          displayName
        }
        username={username}
        coverUrl={
          avatarUrl
        }
        description={
          MOCK_DESCRIPTION
        }
        verified
        onPressEditProfile={
          openEditProfile
        }
      />

      <ProfileMockStats
        followers={
          stats.followers
        }
        emissions={
          stats.emissions
        }
      />

      <View
        style={liveAreaStyle}
      >
        <ProfileMockLatestLive />
      </View>

      <View
        style={highlightsStyle}
      >
        <ProfileMockHighlights
          expanded={
            highlightsExpanded
          }
          onPressViewAll={
            handleToggleHighlights
          }
        />
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {highlightsExpanded && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={
            styles.expandedContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          {profileContent}
        </ScrollView>
      )}

      {!highlightsExpanded && (
        <View style={styles.content}>
          {profileContent}
        </View>
      )}

      <ProfileSettingsPanel
        visible={
          settingsVisible
        }
        onClose={() => {
          setSettingsVisible(
            false,
          );
        }}
        onEditProfile={
          openEditProfile
        }
        onLogout={() => {
          setSettingsVisible(
            false,
          );

          void logout();
        }}
      />

      <ProfileEditPanel
        visible={
          editVisible
        }
        username={username}
        displayName={
          displayName
        }
        description={
          MOCK_DESCRIPTION
        }
        location=""
        avatarUrl={
          avatarUrl
        }
        isSavingUsername={
          isSavingUsername
        }
        error={error}
        onClose={() => {
          setEditVisible(
            false,
          );

          setError(null);
        }}
        onSaveUsername={
          handleSaveUsername
        }
        onUploadAvatar={
          handleUploadAvatar
        }
        onSaveProfile={
          handleSaveProfile
        }
        onChangeMockProfile={() => {
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06101A",
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: BOTTOM_NAV_SPACE,
    backgroundColor: "#06101A",
  },

  scroll: {
    flex: 1,
  },

  expandedContent: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom:
      BOTTOM_NAV_SPACE + 20,
    backgroundColor: "#06101A",
  },

  liveArea: {
    flex: 1,
    minHeight: 0,
  },

  liveAreaExpanded: {
    height: 245,
  },

  highlightsFooter: {
    flexShrink: 0,
  },

  highlightsExpanded: {
    flexShrink: 0,
  },
});