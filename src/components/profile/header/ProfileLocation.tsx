// src/components/profile/header/ProfileLocation.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  location: string;
};

export function ProfileLocation({ location }: Props) {
  if (!location) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons name="location-outline" size={13} color="#A8B5C5" />
      <Text style={styles.text}>{location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  text: {
    color: "#A8B5C5",
    fontSize: 11,
    fontWeight: "500",
  },
});
