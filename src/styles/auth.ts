// src/styles/auth.ts

import { StyleSheet } from "react-native";

import { colors } from "./colors";
import { controls } from "./controls";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const authStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  background: {
    flex: 1,
    overflow: "hidden",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  layout: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },

  layoutCompact: {
    paddingVertical: spacing.sm,
  },

  layoutTabletLandscape: {
    maxWidth: 1050,
    flexDirection: "row",
    alignItems: "center",
    gap: 72,
  },

  brandColumn: {
    alignItems: "center",
    justifyContent: "center",
  },

  brandColumnTablet: {
    flex: 1,
  },

  formColumn: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },

  formColumnTablet: {
    flex: 1,
    maxWidth: 460,
  },

  glow: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: colors.accentGlow,
    top: -220,
    alignSelf: "center",
  },

  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.xl,

    shadowColor: colors.pureBlack,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 14,
  },

  cardCompact: {
    padding: spacing.md,
  },

  heading: {
    marginBottom: spacing.lg,
  },

  headingCompact: {
    marginBottom: spacing.sm,
  },

  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 25,
    lineHeight: 30,
  },

  titleCompact: {
    fontSize: 21,
    lineHeight: 25,
  },

  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  subtitleCompact: {
    fontSize: 12,
    lineHeight: 16,
  },

  modeSelector: {
    flexDirection: "row",
    padding: spacing.xxs,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    marginBottom: spacing.lg,
  },

  modeSelectorCompact: {
    marginBottom: spacing.sm,
  },

  modeButton: {
    flex: 1,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
  },

  modeButtonCompact: {
    height: 34,
  },

  modeButtonActive: {
    backgroundColor: colors.surfaceElevated,
  },

  modeText: {
    ...typography.bodyStrong,
    color: colors.textMuted,
  },

  modeTextActive: {
    color: colors.text,
  },

  fields: {
    gap: spacing.sm,
  },

  fieldsCompact: {
    gap: spacing.xs,
  },

  field: {
    width: "100%",
  },

  label: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontSize: 12,
  },

  input: {
    ...typography.body,
    minHeight: controls.primaryButtonHeight,
    color: colors.text,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },

  inputCompact: {
    minHeight: 44,
  },

  passwordField: {
    minHeight: controls.primaryButtonHeight,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingRight: spacing.md,
  },

  passwordFieldCompact: {
    minHeight: 44,
  },

  passwordInput: {
    ...typography.body,
    flex: 1,
    minHeight: controls.primaryButtonHeight,
    color: colors.text,
    paddingHorizontal: spacing.md,
  },

  passwordInputCompact: {
    minHeight: 44,
  },

  passwordAction: {
    ...typography.bodyStrong,
    color: colors.accent,
    fontSize: 12,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: spacing.sm,
  },

  rememberRowCompact: {
    marginTop: spacing.xs,
  },

  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xs,
  },

  checkboxActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },

  checkboxDot: {
    width: 7,
    height: 7,
    borderRadius: radius.round,
    backgroundColor: colors.accent,
  },

  rememberText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 12,
  },

  errorBox: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSurface,
  },

  error: {
    ...typography.body,
    color: colors.dangerText,
    fontSize: 12,
  },

  primaryButton: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    overflow: "hidden",
  },

  primaryButtonCompact: {
    marginTop: spacing.sm,
  },

  primaryButtonPressed: {
    opacity: 0.88,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  disabled: {
    opacity: 0.65,
  },

  primaryGradient: {
    height: controls.primaryButtonHeight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },

  primaryGradientCompact: {
    height: 44,
  },

  primaryButtonText: {
    ...typography.bodyStrong,
    color: colors.text,
    fontSize: 15,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginVertical: spacing.md,
  },

  dividerCompact: {
    marginVertical: spacing.sm,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
  },

  guestButton: {
    minHeight: controls.primaryButtonHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },

  guestButtonCompact: {
    minHeight: 44,
  },

  guestButtonPressed: {
    backgroundColor: colors.surfaceElevated,
  },

  guestButtonText: {
    ...typography.bodyStrong,
    color: colors.text,
  },

  guestArrow: {
    position: "absolute",
    right: spacing.md,
    color: colors.accent,
    fontSize: 20,
  },

  footer: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 14,
    marginTop: spacing.md,
  },

  footerCompact: {
    marginTop: spacing.sm,
  },
});