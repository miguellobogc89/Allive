// src/components/live/broadcast/metadata/LiveBroadcastLocation.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type LiveBroadcastLocationProps = {
  location: string | null;
};

export function LiveBroadcastLocation({
  location,
}: LiveBroadcastLocationProps) {
  if (!location) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons
        name="location-outline"
        size={13}
        color="rgba(255,255,255,0.78)"
      />

      <Text
        style={styles.location}
        numberOfLines={1}
      >
        {location}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    gap: 4,
  },

  location: {
    flexShrink: 1,

    color:
      "rgba(255,255,255,0.78)",

    fontSize: 12,
    fontWeight: "500",
  },
});