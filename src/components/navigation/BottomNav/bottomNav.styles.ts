// src/components/navigation/BottomNav/bottomNav.styles.ts

import { StyleSheet } from "react-native";
import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../styles";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.sm,
    zIndex: 100,
  },

  containerCompact: {
    paddingHorizontal: spacing.xl,
  },

  pill: {
    width: "100%",
    maxWidth: 560,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xxs,
    borderRadius: radius.round,
    overflow: "hidden",
  },

  pillCompact: {
    maxWidth: 480,
    height: 54,
    paddingHorizontal: spacing.xs,
  },

  tab: {
    flex: 1,
    minWidth: 0,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  tabCompact: {
    height: 48,
  },

  tabIcon: {
    minWidth: 38,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.round,
  },

  tabIconActive: {
    backgroundColor: "rgba(255,255,255,0.11)",
  },

  tabIconCompact: {
    minWidth: 36,
    height: 36,
  },

  label: {
    color: colors.textOnOverlayMuted,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: typography.caption.fontWeight,
    letterSpacing: 0.25,
  },

  activeLabel: {
    color: colors.text,
  },

  emitWrapper: {
    flex: 1,
    minWidth: 0,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  emitWrapperCompact: {
    height: 48,
  },

  emitButton: {
    width: 46,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.liveStrong,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    shadowColor: colors.live,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 5,
  },

  emitButtonStart: {
    backgroundColor: colors.live,
    borderColor: "rgba(255,255,255,0.24)",
  },

  emitButtonCompact: {
    width: 42,
    height: 34,
    borderRadius: radius.md,
  },

  emitLabel: {
    color: colors.textOnOverlaySecondary,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "700",
    letterSpacing: 0.25,
  },

  emitLabelActive: {
    color: colors.text,
  },

  emitDisabled: {
    opacity: 0.46,
  },

  itemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});