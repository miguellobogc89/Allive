// src/components/live/replay/header/ReplayStatus.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type ReplayStatusProps = {
  endedAt: string;
};

function getRelativeTime(endedAt: string) {
  const ended = new Date(endedAt).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(
    1,
    Math.floor((now - ended) / 60_000),
  );

  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} min`;
  }

  const hours = Math.floor(diffMinutes / 60);

  if (hours < 24) {
    return hours === 1 ? "Hace 1 h" : `Hace ${hours} h`;
  }

  const days = Math.floor(hours / 24);

  return days === 1 ? "Hace 1 día" : `Hace ${days} días`;
}

export function ReplayStatus({
  endedAt,
}: ReplayStatusProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>
        {getRelativeTime(endedAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(35,39,44,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.65)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 2,
  },
});
