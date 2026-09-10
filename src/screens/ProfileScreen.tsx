// src/screens/ProfileScreen.tsx

import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useMemo, useState } from "react";

import { getMyLives } from "../api/profileApi";
import { useAuth } from "../auth/AuthContext";
import {
  LiveScoreCard,
  ProfileEditPanel,
  ProfileIdentity,
  ProfileSettingsPanel,
  ProfileStats,
  ProfileTopBar,
  ProfileVideoGallery,
  type ProfileVideoItem,
} from "../components/profile";

const MOCK_DESCRIPTION =
  "Directos desde cualquier parte. Aquí para mostrar lo que está ocurriendo.";

const MOCK_LOCATION =
  "Sevilla, España";

const MOCK_VIDEOS: ProfileVideoItem[] = [
  {
    id: "mock-1",
    title: "Centro de Sevilla",
    placeName: "Sevilla",
    startedAt: new Date(
      Date.now() - 2 * 60 * 60 * 1000,
    ).toISOString(),
    endedAt: new Date(
      Date.now() - 90 * 60 * 1000,
    ).toISOString(),
    thumbnailUrl: null,
    viewerCount: 1284,
    isMock: true,
  },
  {
    id: "mock-2",
    title: "Atardecer en La Barrosa",
    placeName: "Chiclana",
    startedAt: new Date(
      Date.now() - 26 * 60 * 60 * 1000,
    ).toISOString(),
    endedAt: new Date(
      Date.now() - 25 * 60 * 60 * 1000,
    ).toISOString(),
    thumbnailUrl: null,
    viewerCount: 638,
    isMock: true,
  },
  {
    id: "mock-3",
    title: "Concierto en directo",
    placeName: "Sevilla",
    startedAt: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    endedAt: new Date(
      Date.now() -
        3 * 24 * 60 * 60 * 1000 +
        70 * 60 * 1000,
    ).toISOString(),
    thumbnailUrl: null,
    viewerCount: 2103,
    isMock: true,
  },
  {
    id: "mock-4",
    title: "Noche en el centro",
    placeName: "Sevilla",
    startedAt: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    endedAt: new Date(
      Date.now() -
        5 * 24 * 60 * 60 * 1000 +
        42 * 60 * 1000,
    ).toISOString(),
    thumbnailUrl: null,
    viewerCount: 914,
    isMock: true,
  },
];

export function ProfileScreen() {
  const {
    user,
    token,
    isGuest,
    updateUsername,
    logout,
  } = useAuth();

  const [realLives, setRealLives] =
    useState<ProfileVideoItem[]>([]);

  const [settingsVisible, setSettingsVisible] =
    useState(false);

  const [editVisible, setEditVisible] =
    useState(false);

  const [isSavingUsername, setIsSavingUsername] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [mockDisplayName, setMockDisplayName] =
    useState(
      user?.displayName ||
        user?.username ||
        "Invitado",
    );

  const [mockDescription, setMockDescription] =
    useState(MOCK_DESCRIPTION);

  const [mockLocation, setMockLocation] =
    useState(MOCK_LOCATION);

  const [mockAvatarUrl, setMockAvatarUrl] =
    useState<string | null>(
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
        const result = await getMyLives(
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
            startedAt: live.startedAt,
            endedAt: live.endedAt,
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

    if (realLives.length >= 4) {
      return realLives;
    }

    const missing =
      4 - realLives.length;

    return [
      ...realLives,
      ...MOCK_VIDEOS.slice(0, missing),
    ];
  }, [realLives]);

  const username =
    user?.username || "invitado";

  const emissionCount =
    realLives.length > 0
      ? String(realLives.length)
      : "27";

  async function handleSaveUsername(
    nextUsername: string,
  ) {
    if (!user) {
      setEditVisible(false);
      return;
    }

    const normalized =
      nextUsername.trim().toLowerCase();

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

      await updateUsername(normalized);

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
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ProfileTopBar
          username={username}
          onPressSettings={() => {
            setSettingsVisible(true);
          }}
        />

        <ProfileIdentity
          displayName={mockDisplayName}
          username={username}
          avatarUrl={mockAvatarUrl}
          description={mockDescription}
          location={mockLocation}
          onPressAvatar={openEditProfile}
          onPressEditProfile={openEditProfile}
        />

        <ProfileStats
          liveScore="8.4"
          emissions={emissionCount}
          averageViewers="2,3K"
        />

        <LiveScoreCard score="8.4" />

        <ProfileVideoGallery
          videos={videos}
        />
      </ScrollView>

      <ProfileSettingsPanel
        visible={settingsVisible}
        onClose={() => {
          setSettingsVisible(false);
        }}
        onEditProfile={openEditProfile}
        onLogout={() => {
          setSettingsVisible(false);
          void logout();
        }}
      />

      <ProfileEditPanel
        visible={editVisible}
        username={username}
        displayName={mockDisplayName}
        description={mockDescription}
        location={mockLocation}
        avatarUrl={mockAvatarUrl}
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

      {isGuest ? null : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 130,
    backgroundColor: "#FFFFFF",
  },
});
