// src/components/profile/header/ProfileIdentity.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  displayName: string;
  username: string;
  verified?: boolean;
};

export function ProfileIdentity({
  displayName,
  username,
  verified = false,
}: Props) {
  return (
    <View>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{displayName}</Text>

        {verified && (
          <View style={styles.verified}>
            <Ionicons name="checkmark" size={10} color="#FFFFFF" />
          </View>
        )}
      </View>

      <Text style={styles.username}>@{username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  verified: {
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2296FF",
  },

  username: {
    marginTop: 1,
    color: "#B1BDCB",
    fontSize: 13,
    fontWeight: "600",
  },
});
