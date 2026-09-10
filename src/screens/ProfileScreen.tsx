// src/screens/ProfileScreen.tsx

import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getMyLives } from "../api/profileApi";
import { useAuth } from "../auth/AuthContext";

import {
  ProfileEditPanel,
  ProfileHero,
  ProfileHighlightsSection,
  ProfileLatestLiveSection,
  ProfileSettingsPanel,
  ProfileStats,
  ProfileTopBar,
  type ProfileVideoItem,
} from "../components/profile";

const MOCK_DESCRIPTION =
  "Vivo el presente, grabo lo real. Gente bonita, planes locos y buenas vibras.";

const MOCK_LOCATION = "Sevilla, España";

const MOCK_VIDEOS: ProfileVideoItem[] = [
  {
    id: "mock-1",
    title: "Atardeceres que sanan",
    placeName: "Madrid",
    startedAt: new Date(
      Date.now() - 2 * 60 * 60 * 1000,
    ).toISOString(),
    endedAt: new Date(
      Date.now() - 90 * 60 * 1000,
    ).toISOString(),
    thumbnailUrl: null,
    viewerCount: 412000,
    isMock: true,
  },
  {
    id: "mock-2",
    title: "Mi equipo",
    placeName: "Sevilla",
    startedAt: new Date(
      Date.now() - 5 * 60 * 60 * 1000,
    ).toISOString(),
    endedAt: new Date(
      Date.now() - 4 * 60 * 60 * 1000,
    ).toISOString(),
    thumbnailUrl: null,
    viewerCount: 287000,
    isMock: true,
  },
  {
    id: "mock-3",
    title: "Workout & mindset",
    placeName: "Sevilla",
    startedAt: new Date(
      Date.now() - 8 * 60 * 60 * 1000,
    ).toISOString(),
    endedAt: new Date(
      Date.now() - 7 * 60 * 60 * 1000,
    ).toISOString(),
    thumbnailUrl: null,
    viewerCount: 180000,
    isMock: true,
  },
  {
    id: "mock-4",
    title: "Noche en Madrid",
    placeName: "Madrid",
    startedAt: new Date(
      Date.now() - 12 * 60 * 60 * 1000,
    ).toISOString(),
    endedAt: new Date(
      Date.now() - 11 * 60 * 60 * 1000,
    ).toISOString(),
    thumbnailUrl: null,
    viewerCount: 310000,
    isMock: true,
  },
  {
    id: "mock-5",
    title: "Q&A real",
    placeName: "Sevilla",
    startedAt: new Date(
      Date.now() - 18 * 60 * 60 * 1000,
    ).toISOString(),
    endedAt: new Date(
      Date.now() - 17 * 60 * 60 * 1000,
    ).toISOString(),
    thumbnailUrl: null,
    viewerCount: 220000,
    isMock: true,
  },
];

export function ProfileScreen() {
  const {
    user,
    token,
    updateUsername,
    logout,
  } = useAuth();

  const [realLives, setRealLives] =
    useState<ProfileVideoItem[]>([]);

  const [
    settingsVisible,
    setSettingsVisible,
  ] = useState(false);

  const [
    editVisible,
    setEditVisible,
  ] = useState(false);

  const [
    isSavingUsername,
    setIsSavingUsername,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [
    mockDisplayName,
    setMockDisplayName,
  ] = useState(
    user?.displayName ||
      user?.username ||
      "Invitado",
  );

  const [
    mockDescription,
    setMockDescription,
  ] = useState(MOCK_DESCRIPTION);

  const [
    mockLocation,
    setMockLocation,
  ] = useState(MOCK_LOCATION);

  const [
    mockAvatarUrl,
    setMockAvatarUrl,
  ] = useState<string | null>(
    user?.avatarUrl ?? null,
  );

  useEffect(() => {
    setMockDisplayName(
      user?.displayName ||
        user?.username ||
        "Invitado",
    );

    setMockAvatarUrl(
      user?.avatarUrl ?? null,
    );
  }, [
    user?.displayName,
    user?.username,
    user?.avatarUrl,
  ]);

  useEffect(() => {
    if (!token) {
      setRealLives([]);
      return;
    }

    const controller =
      new AbortController();

    async function loadLives() {
      try {
        const result =
          await getMyLives(
            token!,
            controller.signal,
          );

        setRealLives(
          result.map((live) => ({
            id: live.id,
            title:
              live.title ||
              "LIVE sin título",
            placeName:
              live.placeName ||
              "Sin ubicación",
            startedAt:
              live.startedAt,
            endedAt:
              live.endedAt,
            thumbnailUrl:
              live.thumbnailUrl,
          })),
        );
      } catch (loadError) {
        if (
          loadError instanceof Error &&
          loadError.name === "AbortError"
        ) {
          return;
        }

        setRealLives([]);
      }
    }

    void loadLives();

    return () => {
      controller.abort();
    };
  }, [token]);

  const videos = useMemo(() => {
    if (realLives.length === 0) {
      return MOCK_VIDEOS;
    }

    if (realLives.length >= 5) {
      return realLives;
    }

    return [
      ...realLives,
      ...MOCK_VIDEOS.slice(
        0,
        5 - realLives.length,
      ),
    ];
  }, [realLives]);

  const username =
    user?.username || "invitado";

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

    if (
      !normalized ||
      normalized === user.username
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
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo actualizar el perfil",
      );
    } finally {
      setIsSavingUsername(false);
    }
  }

  function openEditProfile() {
    setSettingsVisible(false);
    setError(null);
    setEditVisible(true);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        <ProfileTopBar
          username={username}
          onPressSettings={() => {
            setSettingsVisible(true);
          }}
        />

        <ProfileHero
          displayName={
            mockDisplayName
          }
          username={username}
          coverUrl={
            mockAvatarUrl
          }
          description={
            mockDescription
          }
          location={
            mockLocation
          }
          verified
          onPressEditProfile={
            openEditProfile
          }
        />

        <ProfileStats
          hoursLive="320"
          community="12,4K"
          totalViews="1,2M"
          liveScore="8,4"
        />

        <ProfileLatestLiveSection
          video={videos[0]}
        />

<ProfileHighlightsSection
  videos={videos.slice(1)}
/>
      </ScrollView>

      <ProfileSettingsPanel
        visible={
          settingsVisible
        }
        onClose={() => {
          setSettingsVisible(false);
        }}
        onEditProfile={
          openEditProfile
        }
        onLogout={() => {
          setSettingsVisible(false);
          void logout();
        }}
      />

      <ProfileEditPanel
        visible={editVisible}
        username={username}
        displayName={
          mockDisplayName
        }
        description={
          mockDescription
        }
        location={
          mockLocation
        }
        avatarUrl={
          mockAvatarUrl
        }
        isSavingUsername={
          isSavingUsername
        }
        error={error}
        onClose={() => {
          setEditVisible(false);
          setError(null);
        }}
        onSaveUsername={
          handleSaveUsername
        }
        onChangeMockProfile={(
          value,
        ) => {
          setMockDisplayName(
            value.displayName,
          );
          setMockDescription(
            value.description,
          );
          setMockLocation(
            value.location,
          );
          setMockAvatarUrl(
            value.avatarUrl,
          );
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
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",

    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 140,

    backgroundColor: "#06101A",
  },
});