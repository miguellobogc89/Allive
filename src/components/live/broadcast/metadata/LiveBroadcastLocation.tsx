// src/components/live/broadcast/metadata/LiveBroadcastLocation.tsx

import { StyleSheet, Text } from "react-native";

type LiveBroadcastLocationProps = {
  location: string | null;
};

export function LiveBroadcastLocation({
  location,
}: LiveBroadcastLocationProps) {
  if (!location) {
    return null;
  }

  return <Text style={styles.location}>{location}</Text>;
}

const styles = StyleSheet.create({
  location: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
  },
});
