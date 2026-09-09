// src/screens/ProfileScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { useAuth } from "../auth/AuthContext";
import {
  colors,
  controls,
  spacing,
  typography,
} from "../styles";

const stats = [
  {
    id: "hours",
    value: "18,4 h",
    label: "En directo",
  },
  {
    id: "viewers",
    value: "12,8K",
    label: "Espectadores",
  },
  {
    id: "sessions",
    value: "27",
    label: "LIVE",
  },
];

const recentLives = [
  {
    id: "1",
    title: "La Barrosa",
    location: "Chiclana",
    viewers: "1.284",
    duration: "42 min",
  },
  {
    id: "2",
    title: "Centro de Sevilla",
    location: "Sevilla",
    viewers: "638",
    duration: "28 min",
  },
  {
    id: "3",
    title: "Concierto en directo",
    location: "Sevilla",
    viewers: "2.103",
    duration: "1 h 12 min",
  },
];

export function ProfileScreen() {
  const {
    user,
    isGuest,
    updateUsername,
    logout,
  } = useAuth();

  const [username, setUsername] =
    useState(user?.username ?? "");

  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    setUsername(user?.username ?? "");
  }, [user?.username]);

  const profileName =
    user?.displayName ||
    user?.username ||
    "Invitado";

  const avatarLetter =
    profileName
      .trim()
      .charAt(0)
      .toUpperCase() || "?";

  async function saveUsername() {
    const nextUsername =
      username.trim().toLowerCase();

    if (
      !nextUsername ||
      nextUsername === user?.username
    ) {
      setUsername(user?.username ?? "");
      setIsEditing(false);
      setError(null);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await updateUsername(
        nextUsername,
      );

      setIsEditing(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo cambiar el nombre de usuario",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.pageTitle}>
            Tú
          </Text>

          <Pressable
            style={styles.settingsButton}
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {avatarLetter}
            </Text>
          </View>

          <Text style={styles.name}>
            {profileName}
          </Text>

          {user && !isEditing ? (
            <Pressable
              style={styles.usernameRow}
              onPress={() => {
                setError(null);
                setIsEditing(true);
              }}
            >
              <Text style={styles.username}>
                @{user.username}
              </Text>

              <Ionicons
                name="pencil-outline"
                size={13}
                color={colors.textSecondary}
              />
            </Pressable>
          ) : null}

          {user && isEditing ? (
            <View style={styles.editor}>
              <View style={styles.inputRow}>
                <Text style={styles.atSign}>
                  @
                </Text>

                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                  editable={!isSaving}
                  style={styles.usernameInput}
                  placeholder="usuario"
                  placeholderTextColor={
                    colors.textMuted
                  }
                  onSubmitEditing={() => {
                    void saveUsername();
                  }}
                />
              </View>

              <View
                style={
                  styles.editorActions
                }
              >
                <Pressable
                  style={
                    styles.cancelButton
                  }
                  disabled={isSaving}
                  onPress={() => {
                    setUsername(
                      user.username,
                    );
                    setError(null);
                    setIsEditing(false);
                  }}
                >
                  <Text
                    style={
                      styles.cancelButtonText
                    }
                  >
                    Cancelar
                  </Text>
                </Pressable>

                <Pressable
                  style={
                    styles.saveButton
                  }
                  disabled={isSaving}
                  onPress={() => {
                    void saveUsername();
                  }}
                >
                  <Text
                    style={
                      styles.saveButtonText
                    }
                  >
                    {isSaving
                      ? "Guardando..."
                      : "Guardar"}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {isGuest ? (
            <Text style={styles.username}>
              Sesión de invitado
            </Text>
          ) : null}

          {error ? (
            <Text style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={
                colors.textSecondary
              }
            />

            <Text style={styles.location}>
              Sevilla, España
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          {stats.map((stat) => (
            <View
              key={stat.id}
              style={styles.stat}
            >
              <Text
                style={styles.statValue}
              >
                {stat.value}
              </Text>

              <Text
                style={styles.statLabel}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.scoreCard}>
          <View>
            <Text style={styles.scoreLabel}>
              LIVE SCORE
            </Text>

            <Text
              style={
                styles.scoreDescription
              }
            >
              Rendimiento de tus directos
            </Text>
          </View>

          <View style={styles.score}>
            <Text style={styles.scoreValue}>
              8.4
            </Text>

            <Text style={styles.scoreMax}>
              /10
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Tus últimos LIVE
          </Text>

          <Text
            style={styles.sectionAction}
          >
            Ver todos
          </Text>
        </View>

        <View style={styles.liveList}>
          {recentLives.map((live) => (
            <Pressable
              key={live.id}
              style={styles.liveItem}
            >
              <View
                style={styles.thumbnail}
              >
                <Ionicons
                  name="videocam-outline"
                  size={22}
                  color={
                    colors.textOnOverlaySubtle
                  }
                />
              </View>

              <View style={styles.liveInfo}>
                <Text
                  style={styles.liveTitle}
                >
                  {live.title}
                </Text>

                <Text
                  style={
                    styles.liveLocation
                  }
                >
                  {live.location} ·{" "}
                  {live.duration}
                </Text>
              </View>

              <View
                style={styles.viewerRow}
              >
                <Ionicons
                  name="eye-outline"
                  size={14}
                  color={
                    colors.textSecondary
                  }
                />

                <Text
                  style={styles.viewerText}
                >
                  {live.viewers}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={() => {
            void handleLogout();
          }}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={colors.text}
          />

          <Text
            style={styles.logoutButtonText}
          >
            Cerrar sesión
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 22,
    paddingBottom: 130,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pageTitle: {
    color: colors.text,
    ...typography.screenTitle,
  },

  settingsButton: {
    width: controls.circleButtonSize,
    height: controls.circleButtonSize,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },

  profile: {
    marginTop: 24,
    alignItems: "center",
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      colors.surfaceElevated,
    borderWidth: 2,
    borderColor:
      colors.borderOnOverlay,
  },

  avatarText: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
  },

  name: {
    marginTop: 12,
    color: colors.text,
    fontSize: 21,
    fontWeight: "900",
  },

  usernameRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  username: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },

  editor: {
    width: "100%",
    maxWidth: 320,
    marginTop: 12,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  atSign: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },

  usernameInput: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  editorActions: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },

  cancelButton: {
    minHeight: 36,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.surface,
  },

  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },

  saveButton: {
    minHeight: 36,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.text,
  },

  saveButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "800",
  },

  errorText: {
    marginTop: 8,
    color: "#FF5A5F",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  locationRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  location: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  stats: {
    marginTop: 26,
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  stat: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },

  statValue: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },

  statLabel: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "600",
  },

  scoreCard: {
    marginTop: 12,
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  scoreLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  scoreDescription: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 10,
  },

  score: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  scoreValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },

  scoreMax: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },

  sectionHeader: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: colors.text,
    ...typography.sectionTitle,
  },

  sectionAction: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },

  liveList: {
    marginTop: 10,
    gap: 5,
  },

  liveItem: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },

  thumbnail: {
    width: 72,
    height: 52,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      colors.surfaceElevated,
  },

  liveInfo: {
    flex: 1,
    marginLeft: 11,
  },

  liveTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },

  liveLocation: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 10,
  },

  viewerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  viewerText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
  },

  logoutButton: {
    marginTop: 34,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  logoutButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
});