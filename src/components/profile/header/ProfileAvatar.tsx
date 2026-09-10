// src/components/profile/header/ProfileAvatar.tsx

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
  onPress?: () => void;
};

export function ProfileAvatar({
  displayName,
  username,
  avatarUrl,
  onPress,
}: Props) {
  const letter =
    displayName.trim().charAt(0).toUpperCase() ||
    username.trim().charAt(0).toUpperCase() ||
    "?";

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View style={styles.glow}>
        <View style={styles.avatarBorder}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.fallback}>
              <Text style={styles.letter}>{letter}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.camera}>
        <Ionicons name="camera" size={14} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 104,
    height: 104,
  },

  glow: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(35, 134, 255, 0.16)",
  },

  avatarBorder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    borderWidth: 2,
    borderColor: "#2386FF",
    backgroundColor: "#0B111A",
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
  },

  fallback: {
    flex: 1,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#151D28",
  },

  letter: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
  },

  camera: {
    position: "absolute",
    right: 0,
    bottom: 3,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2386FF",
    borderWidth: 3,
    borderColor: "#08090A",
  },
});