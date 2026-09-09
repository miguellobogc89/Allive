// src/components/live/LiveBroadcastError.tsx

import { StyleSheet, Text, View } from "react-native";

import { colors, layout, radius, typography } from "../../styles";

type LiveBroadcastErrorProps = {
  message: string | null;
};

export function LiveBroadcastError({ message }: LiveBroadcastErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: layout.overlayHorizontal,
    right: layout.overlayHorizontal,
    bottom: layout.broadcastErrorBottom,
    padding: 11,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSurface,
    zIndex: 30,
  },
  text: {
    color: colors.dangerText,
    fontSize: typography.caption.fontSize,
    lineHeight: 16,
  },
});
