// src/components/live/broadcast/metadata/LiveBroadcastTitle.tsx

import { StyleSheet, Text } from "react-native";

type LiveBroadcastTitleProps = {
  title: string;
};

export function LiveBroadcastTitle({
  title,
}: LiveBroadcastTitleProps) {
  if (!title) {
    return null;
  }

  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
