// src/components/live/LiveHeader.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type LiveHeaderProps = { viewerCount: number };

export function LiveHeader({ viewerCount }: LiveHeaderProps) {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      <View style={styles.viewerBadge}>
        <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
        <Text style={styles.viewerText}>{viewerCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", top: 18, left: 16, flexDirection: "row", alignItems: "center", gap: 8, zIndex: 20 },
  liveBadge: { height: 30, paddingHorizontal: 10, borderRadius: 9, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FF3B30" },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#FFFFFF" },
  liveText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900", letterSpacing: 0.4 },
  viewerBadge: { height: 30, paddingHorizontal: 10, borderRadius: 9, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(0,0,0,0.52)" },
  viewerText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
});
