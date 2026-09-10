// src/components/profile/ProfileIdentity.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  displayName: string;
  username: string;
  avatarUrl: string | null;
  description: string;
  location: string;
  onPressAvatar: () => void;
  onPressEditProfile: () => void;
};

export function ProfileIdentity({
  displayName,
  username,
  avatarUrl,
  description,
  location,
  onPressAvatar,
  onPressEditProfile,
}: Props) {
  const avatarLetter =
    displayName.trim().charAt(0).toUpperCase() ||
    username.trim().charAt(0).toUpperCase() ||
    "?";

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        <Pressable
          onPress={onPressAvatar}
          style={styles.avatarButton}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarLetter}>
                {avatarLetter}
              </Text>
            </View>
          )}

          <View style={styles.editAvatarBadge}>
            <Ionicons
              name="camera"
              size={14}
              color="#FFFFFF"
            />
          </View>
        </Pressable>

        <View style={styles.identityText}>
          <Text style={styles.displayName}>
            {displayName}
          </Text>

          <Text style={styles.handle}>
            @{username}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        {description}
      </Text>

      <View style={styles.locationRow}>
        <Ionicons
          name="location-outline"
          size={14}
          color="#737373"
        />
        <Text style={styles.location}>
          {location}
        </Text>
      </View>

      <Pressable
        onPress={onPressEditProfile}
        style={styles.editButton}
      >
        <Text style={styles.editButtonText}>
          Editar perfil
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },

  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarButton: {
    width: 92,
    height: 92,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#EFEFEF",
  },

  avatarFallback: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFEF",
    borderWidth: 1,
    borderColor: "#DBDBDB",
  },

  avatarLetter: {
    color: "#262626",
    fontSize: 32,
    fontWeight: "800",
  },

  editAvatarBadge: {
    position: "absolute",
    right: 0,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0095F6",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  identityText: {
    flex: 1,
    marginLeft: 18,
  },

  displayName: {
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

  description: {
    marginTop: 16,
    color: "#262626",
    fontSize: 14,
    lineHeight: 20,
  },

  locationRow: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  location: {
    color: "#737373",
    fontSize: 13,
  },

  editButton: {
    minHeight: 38,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#EFEFEF",
  },

  editButtonText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },
});
