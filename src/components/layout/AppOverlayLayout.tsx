// src/components/layout/AppOverlayLayout.tsx

import type {
  ReactNode,
} from "react";

import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  appOverlayLayout,
} from "./overlayLayout.config";

const SHOW_LAYOUT_GUIDES = true;

type AppOverlayLayoutProps = {
  children?: ReactNode;

  header?: ReactNode;
  sideActions?: ReactNode;
  comments?: ReactNode;
  metadata?: ReactNode;
  bottomControls?: ReactNode;
};

export function AppOverlayLayout({
  children,
  header,
  sideActions,
  comments,
  metadata,
  bottomControls,
}: AppOverlayLayoutProps) {
  const insets =
    useSafeAreaInsets();

  const {
    width,
    height,
  } = useWindowDimensions();

  const scale = Math.min(
    appOverlayLayout.scale.max,
    Math.max(
      appOverlayLayout.scale.min,
      width /
        appOverlayLayout.referenceWidth,
    ),
  );

  const horizontalMargin =
    appOverlayLayout.horizontalMargin *
    scale;

  const headerHeight =
    appOverlayLayout.header.height *
    scale;

  const controlsHeight =
    appOverlayLayout.bottomControls.height *
    scale;

  const controlsBottom =
    insets.bottom +
    appOverlayLayout.bottomControls.bottomGap *
      scale;

  const metadataHeight =
    appOverlayLayout.metadata.height *
    scale;

  const metadataBottom =
    controlsBottom +
    controlsHeight +
    appOverlayLayout.metadata.gap *
      scale;

  const commentsHeight =
    appOverlayLayout.comments.height *
    scale;

  const commentsBottom =
    metadataBottom +
    metadataHeight +
    appOverlayLayout.comments.gap *
      scale;

  const sideWidth =
    appOverlayLayout.sideActions.width *
    scale;

  const sideBottom =
    controlsBottom +
    controlsHeight +
    appOverlayLayout.sideActions.bottomGap *
      scale;

  const sideHeight =
    Math.min(
      appOverlayLayout.sideActions.maxHeight *
        scale,

      height *
        appOverlayLayout.sideActions.maxHeightRatio,
    );

  const contentRight =
    horizontalMargin +
    sideWidth +
    12 * scale;

  return (
    <View
      pointerEvents="box-none"
      style={styles.root}
    >
      <View
        pointerEvents="box-none"
        style={styles.content}
      >
        {children}
      </View>

      {/* HEADER */}
      <View
        pointerEvents="box-none"
        style={[
          styles.zone,
          SHOW_LAYOUT_GUIDES &&
            styles.guide,
          {
            top:
              insets.top +
              appOverlayLayout.header.topGap *
                scale,

            left:
              horizontalMargin,

            right:
              horizontalMargin,

            height:
              headerHeight,
          },
        ]}
      >
        {header}
      </View>

      {/* SIDE ACTIONS */}
      <View
        pointerEvents="box-none"
        style={[
          styles.zone,
          styles.sideZone,

          SHOW_LAYOUT_GUIDES &&
            styles.guide,

          {
            right:
              horizontalMargin,

            bottom:
              sideBottom,

            width:
              sideWidth,

            height:
              sideHeight,
          },
        ]}
      >
        {sideActions}
      </View>

      {/* COMMENTS */}
      <View
        pointerEvents="box-none"
        style={[
          styles.zone,

          SHOW_LAYOUT_GUIDES &&
            styles.guide,

          {
            left:
              horizontalMargin,

            right:
              contentRight,

            bottom:
              commentsBottom,

            height:
              commentsHeight,
          },
        ]}
      >
        {comments}
      </View>

      {/* METADATA */}
      <View
        pointerEvents="box-none"
        style={[
          styles.zone,

          SHOW_LAYOUT_GUIDES &&
            styles.guide,

          {
            left:
              horizontalMargin,

            right:
              contentRight,

            bottom:
              metadataBottom,

            height:
              metadataHeight,
          },
        ]}
      >
        {metadata}
      </View>

      {/* BOTTOM CONTROLS */}
      <View
        pointerEvents="box-none"
        style={[
          styles.zone,

          SHOW_LAYOUT_GUIDES &&
            styles.guide,

          {
            left:
              horizontalMargin,

            right:
              horizontalMargin,

            bottom:
              controlsBottom,

            height:
              controlsHeight,
          },
        ]}
      >
        {bottomControls}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    root: {
      flex: 1,
      position: "relative",
    },

    content: {
      ...StyleSheet.absoluteFill,
    },

    zone: {
      position: "absolute",
    },

    guide: {
      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.90)",
    },

    sideZone: {
      alignItems: "stretch",
      justifyContent: "flex-end",
    },
  });