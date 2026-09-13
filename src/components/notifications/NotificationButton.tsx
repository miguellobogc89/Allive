// src/components/notifications/NotificationButton.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type NotificationButtonProps = {
  unreadNotifications?: number;
  onPress?: () => void;
  borderColor?: string;
};

export function NotificationButton({
  unreadNotifications = 0,
  onPress,
  borderColor = "#06101A",
}: NotificationButtonProps) {
  const badge =
    unreadNotifications > 99
      ? "99+"
      : String(unreadNotifications);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.iconButton,
        pressed
          ? styles.pressed
          : undefined,
      ]}
    >
      <Ionicons
        name="notifications-outline"
        size={23}
        color="#FFFFFF"
      />

      {unreadNotifications > 0 ? (
        <View
          style={[
            styles.badge,
            {
              borderColor,
            },
          ]}
        >
          <Text style={styles.badgeText}>
            {badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
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
