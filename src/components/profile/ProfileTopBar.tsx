// src/components/profile/ProfileTopBar.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  username: string;
  onPressSettings: () => void;
};

export function ProfileTopBar({
  username,
  onPressSettings,
}: Props) {
  return (
    <View style={styles.container}>
      <Text
        style={styles.username}
        numberOfLines={1}
      >
        {username}
      </Text>

      <Pressable
        onPress={onPressSettings}
        hitSlop={10}
        style={styles.button}
      >
        <Ionicons
          name="menu-outline"
          size={28}
          color="#111111"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  username: {
    flex: 1,
    marginRight: 16,
    color: "#111111",
    fontSize: 22,
    fontWeight: "800",
  },

  button: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
});
