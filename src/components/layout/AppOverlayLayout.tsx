// src/components/layout/AppOverlayLayout.tsx

import {
  type ReactNode,
  useCallback,
  useMemo,
  useState,
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
  AppOverlaySlotContext,
  type AppOverlaySlotName,
  type AppOverlaySlots,
} from "./AppOverlaySlotContext";

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

  reserveBottomSpace?: boolean;
  replayMode?: boolean;
};

const EMPTY_SLOTS: AppOverlaySlots = {
  header: null,
  sideActions: null,
  comments: null,
  metadata: null,
  bottomControls: null,
};

export function AppOverlayLayout({
  children,
  header,
  sideActions,
  comments,
  metadata,
  bottomControls,
  reserveBottomSpace = false,
  replayMode = false,
}: AppOverlayLayoutProps) {
  const insets = useSafeAreaInsets();

  const {
    width,
    height,
  } = useWindowDimensions();

  const [
    registeredSlots,
    setRegisteredSlots,
  ] = useState<AppOverlaySlots>(
    EMPTY_SLOTS,
  );

  const setSlot = useCallback(
    (
      name: AppOverlaySlotName,
      content: ReactNode | null,
    ) => {
      setRegisteredSlots((current) => {
        if (current[name] === content) {
          return current;
        }

        return {
          ...current,
          [name]: content,
        };
      });
    },
    [],
  );

  const slotContextValue = useMemo(
    () => ({
      setSlot,
    }),
    [setSlot],
  );

  const scale = Math.min(
    appOverlayLayout.scale.max,
    Math.max(
      appOverlayLayout.scale.min,
      width / appOverlayLayout.referenceWidth,
    ),
  );

  const horizontalMargin =
    appOverlayLayout.horizontalMargin * scale;

  const headerHeight =
    appOverlayLayout.header.height * scale;

  const controlsHeight =
    appOverlayLayout.bottomControls.height * scale;

  const controlsBottom =
    insets.bottom +
    appOverlayLayout.bottomControls.bottomGap * scale;

  const reservedBottomHeight =
    reserveBottomSpace
      ? controlsBottom + controlsHeight
      : 0;

const metadataMinHeight =
  appOverlayLayout.metadata.height * scale;

const metadataMaxHeight =
  metadataMinHeight * 1.5;

const metadataBottom =
  reservedBottomHeight +
  (appOverlayLayout.metadata.gap + 12) * scale;

  const commentsHeight =
    appOverlayLayout.comments.height * scale;

const commentsBottom =
  metadataBottom +
  metadataMaxHeight +
  appOverlayLayout.comments.gap * scale;

  const sideWidth =
    appOverlayLayout.sideActions.width * scale;

const sideBottom =
  reservedBottomHeight +
  appOverlayLayout.sideActions.bottomGap * scale;

  const sideHeight = Math.min(
    appOverlayLayout.sideActions.maxHeight * scale,
    height *
      appOverlayLayout.sideActions.maxHeightRatio,
  );

  const contentRight =
    horizontalMargin + sideWidth + 12 * scale;

  const resolvedHeader =
    registeredSlots.header ?? header;

  const resolvedSideActions =
    registeredSlots.sideActions ?? sideActions;

  const resolvedComments =
    registeredSlots.comments ?? comments;

  const resolvedMetadata =
    registeredSlots.metadata ?? metadata;

  const replayControls =
    replayMode
      ? registeredSlots.bottomControls
      : null;

const resolvedBottomControls =
  replayMode
    ? null
    : registeredSlots.bottomControls ??
      bottomControls;

  return (
    <AppOverlaySlotContext.Provider
      value={slotContextValue}
    >
      <View
        pointerEvents="box-none"
        style={styles.root}
      >
        <View
          pointerEvents="box-none"
          style={[
            styles.content,
            {
              bottom: reservedBottomHeight,
            },
          ]}
        >
          {children}
        </View>

        {/* HEADER */}
        <View
          pointerEvents="box-none"
          style={[
            styles.zone,
            SHOW_LAYOUT_GUIDES && styles.guide,
            {
              top:
                insets.top +
                appOverlayLayout.header.topGap *
                  scale,
              left: horizontalMargin,
              right: horizontalMargin,
              height: headerHeight,
            },
          ]}
        >
          {resolvedHeader}
        </View>

        {/* SIDE ACTIONS */}
        <View
          pointerEvents="box-none"
          style={[
            styles.zone,
            styles.sideZone,
            SHOW_LAYOUT_GUIDES && styles.guide,
            {
              right: horizontalMargin,
              bottom: sideBottom,
              width: sideWidth,
              height: sideHeight,
            },
          ]}
        >
          {resolvedSideActions}
        </View>

        {/* COMMENTS */}
        <View
          pointerEvents="box-none"
          style={[
            styles.zone,
            SHOW_LAYOUT_GUIDES && styles.guide,
            {
              left: horizontalMargin,
              right: contentRight,
              bottom: commentsBottom,
              height: commentsHeight,
            },
          ]}
        >
          {resolvedComments}
        </View>

        {/* METADATA */}
        <View
          pointerEvents="box-none"
          style={[
            styles.zone,
            SHOW_LAYOUT_GUIDES && styles.guide,
            {
              left: horizontalMargin,
              right: contentRight,
              bottom: metadataBottom,
              minHeight: metadataMinHeight,
              maxHeight: metadataMaxHeight,
            },
          ]}
        >
          {resolvedMetadata}
        </View>

        {/* CONTROLES PROPIOS DEL REPLAY */}
        {replayMode && replayControls ? (
          <View
            pointerEvents="box-none"
            style={[
              styles.zone,
              styles.bottomZone,
              {
                left: horizontalMargin,
                right: horizontalMargin,
                bottom: reservedBottomHeight,
                height: controlsHeight,
              },
            ]}
          >
            {replayControls}
          </View>
        ) : null}

        {/* BOTTOM NAV COMPARTIDO */}
        <View
          pointerEvents="box-none"
          style={[
            styles.zone,
            styles.bottomZone,
            SHOW_LAYOUT_GUIDES && styles.guide,
            {
              left: horizontalMargin,
              right: horizontalMargin,
              bottom: controlsBottom,
              height: controlsHeight,
            },
          ]}
        >
          {resolvedBottomControls}
        </View>
      </View>
    </AppOverlaySlotContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: "relative",
  },

  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  zone: {
    position: "absolute",
  },

  guide: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.90)",
  },

  sideZone: {
    alignItems: "stretch",
    justifyContent: "flex-end",
  },

  bottomZone: {
    alignItems: "stretch",
    justifyContent: "center",
  },
});