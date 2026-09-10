// src/components/profile/ProfileTopBar.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  username: string;
  onPressSettings: () => void;
  onPressNotifications?: () => void;
};

export function ProfileTopBar({
  onPressSettings,
  onPressNotifications,
}: Props) {
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
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.6,
  },
});