// src/components/profile/ProfileEditPanel.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";

type Props = {
  visible: boolean;
  username: string;
  displayName: string;
  description: string;
  location: string;
  avatarUrl: string | null;
  isSavingUsername: boolean;
  error: string | null;
  onClose: () => void;
  onSaveUsername: (
    username: string,
  ) => Promise<void>;
  onChangeMockProfile: (value: {
    displayName: string;
    description: string;
    location: string;
    avatarUrl: string | null;
  }) => void;
};

export function ProfileEditPanel({
  visible,
  username,
  displayName,
  description,
  location,
  avatarUrl,
  isSavingUsername,
  error,
  onClose,
  onSaveUsername,
  onChangeMockProfile,
}: Props) {
  const [draftUsername, setDraftUsername] =
    useState(username);
  const [draftName, setDraftName] =
    useState(displayName);
  const [draftDescription, setDraftDescription] =
    useState(description);
  const [draftLocation, setDraftLocation] =
    useState(location);
  const [draftAvatarUrl, setDraftAvatarUrl] =
    useState(avatarUrl ?? "");

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDraftUsername(username);
    setDraftName(displayName);
    setDraftDescription(description);
    setDraftLocation(location);
    setDraftAvatarUrl(avatarUrl ?? "");
  }, [
    visible,
    username,
    displayName,
    description,
    location,
    avatarUrl,
  ]);

  async function handleSave() {
    await onSaveUsername(draftUsername);

    onChangeMockProfile({
      displayName:
        draftName.trim() || username,
      description:
        draftDescription.trim(),
      location:
        draftLocation.trim(),
      avatarUrl:
        draftAvatarUrl.trim() || null,
    });
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            hitSlop={10}
          >
            <Ionicons
              name="close"
              size={26}
              color="#111111"
            />
          </Pressable>

          <Text style={styles.title}>
            Editar perfil
          </Text>

          <Pressable
            onPress={() => {
              void handleSave();
            }}
            disabled={isSavingUsername}
          >
            <Text style={styles.save}>
              {isSavingUsername
                ? "Guardando"
                : "Listo"}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>
            Foto de perfil
          </Text>

          <TextInput
            value={draftAvatarUrl}
            onChangeText={setDraftAvatarUrl}
            placeholder="URL de imagen"
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={styles.helper}>
            La URL permite previsualizar la foto ya.
            La subida de archivo se conectará al storage
            cuando montemos el endpoint de avatar.
          </Text>

          <Text style={styles.label}>
            Nombre
          </Text>

          <TextInput
            value={draftName}
            onChangeText={setDraftName}
            placeholder="Nombre visible"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
          />

          <Text style={styles.label}>
            Nombre de usuario
          </Text>

          <TextInput
            value={draftUsername}
            onChangeText={setDraftUsername}
            placeholder="usuario"
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={styles.label}>
            Descripción
          </Text>

          <TextInput
            value={draftDescription}
            onChangeText={setDraftDescription}
            placeholder="Cuenta algo sobre tus directos..."
            placeholderTextColor="#A0A0A0"
            multiline
            maxLength={160}
            style={[
              styles.input,
              styles.descriptionInput,
            ]}
          />

          <Text style={styles.label}>
            Ubicación
          </Text>

          <TextInput
            value={draftLocation}
            onChangeText={setDraftLocation}
            placeholder="Ciudad, país"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
          />

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DBDBDB",
  },

  title: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
  },

  save: {
    color: "#0095F6",
    fontSize: 14,
    fontWeight: "800",
  },

  content: {
    padding: 20,
    paddingBottom: 60,
  },

  label: {
    marginTop: 18,
    marginBottom: 7,
    color: "#262626",
    fontSize: 12,
    fontWeight: "700",
  },

  input: {
    minHeight: 46,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 9,
    color: "#111111",
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },

  descriptionInput: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  helper: {
    marginTop: 7,
    color: "#8E8E8E",
    fontSize: 11,
    lineHeight: 16,
  },

  error: {
    marginTop: 18,
    color: "#ED4956",
    fontSize: 12,
    fontWeight: "600",
  },
});
