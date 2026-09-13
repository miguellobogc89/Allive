// src/components/navigation/BottomNav/bottomNav.styles.ts
import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../../styles";

export const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", paddingHorizontal: spacing.xs, backgroundColor: "#000000", zIndex: 100 },
  tab: { flex: 1, height: 58, alignItems: "center", justifyContent: "center", gap: spacing.xxs },
  label: { color: colors.textOnOverlayMuted, fontSize: 10, fontWeight: typography.caption.fontWeight },
  activeLabel: { color: colors.text, fontWeight: "800" },
  emitWrapper: { flex: 1, alignItems: "center", justifyContent: "flex-end", transform: [{ translateY: -3 }] },
  emitWrapperActive: { transform: [{ translateY: -7 }] },
  emitButton: { width: 54, height: 54, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.overlayRaised, borderWidth: 2, borderColor: colors.borderOnOverlay },
  emitButtonStart: { backgroundColor: colors.live, borderColor: colors.text },
  emitButtonDisabled: { opacity: 0.48 },
  emitInner: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.live },
  emitDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.live },
  emitLabel: { marginTop: 3, color: colors.text, fontSize: typography.micro.fontSize, fontWeight: "800" },
});
