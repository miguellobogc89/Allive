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
  getMyLives,
  getMyProfileStats,
  type ProfileStatsData,
} from "../api/profileApi";

import {
  useAuth,
} from "../auth/AuthContext";

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

const MOCK_LOCATION =
  "Sevilla, España";

type Props = {
  unreadNotifications?: number;
  onOpenNotifications?: () => void;
};

function formatHours(
  value:
    | number
    | null
    | undefined,
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  if (value < 10) {
    return value
      .toFixed(1)
      .replace(".", ",");
  }

  return Math.round(
    value,
  ).toString();
}

function formatCompactNumber(
  value:
    | number
    | null
    | undefined,
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  if (value >= 1_000_000) {
    const formatted =
      (value / 1_000_000)
        .toFixed(1)
        .replace(".", ",");

    return `${
      formatted.replace(
        ",0",
        "",
      )
    }M`;
  }

  if (value >= 1_000) {
    const formatted =
      (value / 1_000)
        .toFixed(1)
        .replace(".", ",");

    return `${
      formatted.replace(
        ",0",
        "",
      )
    }K`;
  }

  return value.toString();
}

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
    realLives,
    setRealLives,
  ] = useState<
    ProfileVideoItem[]
  >([]);

  const [
    profileStats,
    setProfileStats,
  ] =
    useState<
      ProfileStatsData | null
    >(null);

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

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

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
  ] = useState(
    MOCK_DESCRIPTION,
  );

  const [
    mockLocation,
    setMockLocation,
  ] = useState(
    MOCK_LOCATION,
  );

  const [
    mockAvatarUrl,
    setMockAvatarUrl,
  ] =
    useState<string | null>(
      user?.avatarUrl ??
        null,
    );

  useEffect(() => {
    setMockDisplayName(
      user?.displayName ||
        user?.username ||
        "Invitado",
    );

    setMockAvatarUrl(
      user?.avatarUrl ??
        null,
    );
  }, [
    user?.displayName,
    user?.username,
    user?.avatarUrl,
  ]);

  /*
   * Carga independiente de
   * emisiones + estadísticas.
   *
   * Si una falla, no rompe
   * la otra ni la pantalla.
   */
  useEffect(() => {
    if (!token) {
      setRealLives([]);
      setProfileStats(null);
      return;
    }

    const controller =
      new AbortController();

    async function loadProfileData() {
      const [
        livesResult,
        statsResult,
      ] =
        await Promise.allSettled([
          getMyLives(
            token!,
            controller.signal,
          ),

          getMyProfileStats(
            token!,
            controller.signal,
          ),
        ]);

      if (
        controller.signal
          .aborted
      ) {
        return;
      }

      if (
        livesResult.status ===
        "fulfilled"
      ) {
        setRealLives(
          livesResult.value.map(
            (live) => ({
              id:
                live.id,

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
            }),
          ),
        );
      } else {
        console.error(
          "Error cargando emisiones del perfil:",
          livesResult.reason,
        );

        setRealLives([]);
      }

      if (
        statsResult.status ===
        "fulfilled"
      ) {
        setProfileStats(
          statsResult.value,
        );
      } else {
        console.error(
          "Error cargando estadísticas del perfil:",
          statsResult.reason,
        );

        setProfileStats(null);
      }
    }

    void loadProfileData();

    return () => {
      controller.abort();
    };
  }, [token]);

  const username =
    user?.username ||
    "invitado";

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
      normalized ===
        user.username
    ) {
      setEditVisible(false);
      setError(null);
      return;
    }

    try {
      setIsSavingUsername(
        true,
      );

      setError(null);

      await updateUsername(
        normalized,
      );

      setEditVisible(false);
    } catch (saveError) {
      setError(
        saveError
          instanceof Error
          ? saveError.message
          : "No se pudo actualizar el perfil",
      );
    } finally {
      setIsSavingUsername(
        false,
      );
    }
  }

  async function handleUploadAvatar(
    image: Blob,
  ) {
    const updatedUser =
      await uploadAvatar(
        image,
      );

    return (
      updatedUser.avatarUrl
    );
  }

  async function handleSaveProfile(
    value: {
      displayName: string;
      avatarUrl:
        | string
        | null;
    },
  ) {
    await updateProfile(
      value,
    );
  }

  function openEditProfile() {
    setSettingsVisible(false);
    setError(null);
    setEditVisible(true);
  }

  return (
    <View
      style={
        styles.container
      }
    >
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
          username={
            username
          }
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
            mockDisplayName
          }
          username={
            username
          }
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
          hoursLive={
            formatHours(
              profileStats
                ?.hoursLive,
            )
          }
          community={
            formatCompactNumber(
              profileStats
                ?.community,
            )
          }
          totalViews={
            formatCompactNumber(
              profileStats
                ?.totalViews,
            )
          }
          liveScore={
            typeof profileStats
              ?.liveScore ===
            "number"
              ? profileStats.liveScore
                  .toFixed(1)
                  .replace(
                    ".",
                    ",",
                  )
              : "—"
          }
        />

        {realLives.length >
        0 ? (
          <>
            <ProfileLatestLiveSection
              video={
                realLives[0]
              }
            />

            <ProfileHighlightsSection
              videos={
                realLives.slice(
                  1,
                )
              }
            />
          </>
        ) : null}
      </ScrollView>

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
        username={
          username
        }
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
        error={
          error
        }
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

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#06101A",
    },

    content: {
      width: "100%",
      maxWidth: 560,
      alignSelf:
        "center",

      paddingHorizontal:
        18,

      paddingTop: 12,

      paddingBottom:
        140,

      backgroundColor:
        "#06101A",
    },
  });