// src/maps/styles/mapStyles.ts

import { StyleSheet } from "react-native";

import {
  colors,
  controls,
  layout,
  radius,
  spacing,
} from "../../styles";

export const mapStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  map: {
    flex: 1,
  },

  mapAbsolute: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  header: {
    position: "absolute",
    top: layout.overlayTop,
    left: layout.overlayHorizontal,
    right: layout.overlayHorizontal,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    pointerEvents: "box-none",
  },

  indicators: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.overlayMapChrome,
  },

  indicatorTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },

  indicatorRow: {
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  liveDot: {
    width: controls.smallDotSize,
    height: controls.smallDotSize,
    borderRadius: controls.smallDotSize / 2,
    backgroundColor: colors.live,
  },

  indicatorText: {
    color: colors.textOnOverlaySecondary,
    fontSize: 10,
    fontWeight: "700",
  },

  controls: {
    gap: spacing.sm,
  },

  circleButton: {
    width: controls.circleButtonSize,
    height: controls.circleButtonSize,
    borderRadius: controls.circleButtonSize / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.overlayMapChrome,
  },

  statusContainer: {
    position: "absolute",
    left: layout.overlayHorizontal,
    right: layout.overlayHorizontal,
    bottom: 92,
    alignItems: "center",
    pointerEvents: "box-none",
  },

  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.overlayMapChrome,
  },

  statusText: {
    color: colors.textOnOverlaySecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  preview: {
    width: "100%",
    maxWidth: 520,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.overlayMapChrome,
  },

  previewTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  previewIdentity: {
    flex: 1,
  },

  previewUsername: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  previewPlace: {
    marginTop: 2,
    color: colors.textOnOverlaySecondary,
    fontSize: 12,
    fontWeight: "500",
  },

  previewTitle: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  liveBadgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800",
  },

  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  pulseMarker: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  pulseOuter: {
    position: "absolute",
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.live,
  },

  pulseCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.text,
    backgroundColor: colors.live,
  },

  contentMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.borderOnOverlay,
    backgroundColor: colors.overlayMapCluster,
  },

  contentMarkerLive: {
    backgroundColor: colors.live,
  },

  contentMarkerReplay: {
    backgroundColor: "#168CFF",
  },

  contentMarkerText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },

  carouselPanel: {
    width: "100%",
    maxWidth: 560,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.overlayMapChrome,
    pointerEvents: "auto",
  },

  carouselHeader: {
    minHeight: 30,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  carouselTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },

  carouselContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },

  contentCard: {
    width: 245,
    minHeight: 104,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: radius.md,
    backgroundColor: colors.overlayRaisedStrong,
  },

  contentThumbnail: {
    width: 92,
    height: "100%",
    minHeight: 104,
    backgroundColor: colors.surfaceElevated,
  },

  contentThumbnailFallback: {
    width: 92,
    minHeight: 104,
    backgroundColor: colors.surfaceElevated,
  },

  contentCardBody: {
    flex: 1,
    gap: 6,
    padding: spacing.sm,
  },

  contentCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
  },

  contentBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },

  liveContentBadge: {
    backgroundColor: colors.live,
  },

  replayContentBadge: {
    backgroundColor: "#168CFF",
  },

  contentBadgeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
  },

  contentTitle: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
  },

  contentMeta: {
    color: colors.textOnOverlaySecondary,
    fontSize: 11,
    fontWeight: "600",
  },
});
