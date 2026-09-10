// src/components/profile/ProfileTopBar.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  username: string;
  onPressSettings: () => void;
  onPressNotifications?: () => void;
  unreadNotifications?: number;
};

export function ProfileTopBar({
  onPressSettings,
  onPressNotifications,
  unreadNotifications = 0,
}: Props) {
  const badge =
    unreadNotifications > 99
      ? "99+"
      : String(unreadNotifications);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../public/logo/logo_allive.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.actions}>
        <Pressable
          onPress={onPressNotifications}
          hitSlop={10}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={23}
            color="#FFFFFF"
          />
          {unreadNotifications > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badge}
              </Text>
            </View>
          ) : null}
        </Pressable>

        <Pressable
          onPress={onPressSettings}
          hitSlop={10}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 20,

    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    width: 92,
    height: 42,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  iconButton: {
    position: "relative",

    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    position: "absolute",
    top: 1,
    right: 0,

    minWidth: 16,
    height: 16,
    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 4,

    backgroundColor: "#FF3B30",
    borderWidth: 1,
    borderColor: "#06101A",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.6,
  },
});
