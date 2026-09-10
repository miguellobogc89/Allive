// src/components/live/broadcast/overlay/LiveBroadcastError.tsx

import { StyleSheet, Text, View } from "react-native";

type LiveBroadcastErrorProps = {
  message: string | null;
};

export function LiveBroadcastError({
  message,
}: LiveBroadcastErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={styles.container}
    >
      <Text style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 18,
    left: 18,
    right: 18,
    alignItems: "center",
    zIndex: 20,
  },
  text: {
    maxWidth: 520,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    overflow: "hidden",
    color: "#FFFFFF",
    backgroundColor: "rgba(170,20,20,0.78)",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
