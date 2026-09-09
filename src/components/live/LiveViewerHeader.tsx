// src/components/live/LiveViewerHeader.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, controls, iconSizes, spacing, typography } from "../../styles";

type LiveViewerHeaderProps = { viewerCount: number };

export function LiveViewerHeader({ viewerCount }: LiveViewerHeaderProps) {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      <View style={styles.viewerBadge}>
        <Ionicons name="eye-outline" size={iconSizes.sm} color={colors.text} />
        <Text style={styles.viewerText}>{viewerCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", top: 18, left: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.xs, zIndex: 20 },
  liveBadge: { height: controls.compactBadgeHeight, paddingHorizontal: 10, borderRadius: 9, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.live },
  liveDot: { width: controls.badgeDotSize, height: controls.badgeDotSize, borderRadius: 4, backgroundColor: colors.text },
  liveText: { color: colors.text, fontSize: typography.caption.fontSize, fontWeight: "900", letterSpacing: 0.4 },
  viewerBadge: { height: controls.compactBadgeHeight, paddingHorizontal: 10, borderRadius: 9, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: colors.overlayStrong },
  viewerText: { color: colors.text, ...typography.label },
});
