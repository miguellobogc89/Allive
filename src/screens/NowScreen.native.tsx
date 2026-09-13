// src/screens/NowScreen.native.tsx

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  StyleSheet,
  View,
} from "react-native";

import {
  LiveModeSwitch,
} from "../components/live/shared";

import {
  NowSwipeSurface,
} from "../components/live/shared/NowSwipeSurface.native";

import {
  LiveViewerScreen,
} from "./LiveViewerScreen.native";

import {
  ReplayViewerScreen,
} from "./ReplayViewerScreen.native";

type NowMode =
  | "live"
  | "replay";

type NowNavigation = {
  previous: () => void;
  next: () => void;
};

type NowScreenProps = {
  requestedLiveId?:
    | string
    | null;

  requestedReplayId?:
    | string
    | null;

  onOpenUser?: (
    userId: string,
  ) => void;
};

export function NowScreen({
  requestedLiveId = null,
  requestedReplayId = null,
  onOpenUser,
}: NowScreenProps) {
  const [
    mode,
    setMode,
  ] =
    useState<NowMode>(
      requestedReplayId
        ? "replay"
        : "live",
    );

  const [
    navigation,
    setNavigation,
  ] =
    useState<NowNavigation | null>(
      null,
    );

  useEffect(() => {
    if (
      requestedReplayId
    ) {
      setMode(
        "replay",
      );

      return;
    }

    if (
      requestedLiveId
    ) {
      setMode(
        "live",
      );
    }
  }, [
    requestedLiveId,
    requestedReplayId,
  ]);

  useEffect(() => {
    setNavigation(
      null,
    );
  }, [mode]);

  const handleNavigationReady =
    useCallback(
      (
        nextNavigation:
          NowNavigation,
      ) => {
        setNavigation(
          nextNavigation,
        );
      },
      [],
    );

  const handleSwipeUp =
    useCallback(() => {
      navigation?.next();
    }, [navigation]);

  const handleSwipeDown =
    useCallback(() => {
      navigation?.previous();
    }, [navigation]);

  return (
    <View
      style={
        styles.container
      }
    >
      <NowSwipeSurface
        onSwipeUp={
          handleSwipeUp
        }
        onSwipeDown={
          handleSwipeDown
        }
      >
        {mode ===
        "live" ? (
          <LiveViewerScreen
            requestedLiveId={
              requestedLiveId
            }
            onOpenUser={
              onOpenUser
            }
            onNavigationReady={
              handleNavigationReady
            }
          />
        ) : (
          <ReplayViewerScreen
            requestedReplayId={
              requestedReplayId
            }
            onOpenUser={
              onOpenUser
            }
            onNavigationReady={
              handleNavigationReady
            }
          />
        )}
      </NowSwipeSurface>

      <View
        style={
          styles.modeSwitch
        }
        pointerEvents="box-none"
      >
        <LiveModeSwitch
          mode={mode}
          onLivePress={() => {
            setMode(
              "live",
            );
          }}
          onReplayPress={() => {
            setMode(
              "replay",
            );
          }}
        />
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      position:
        "relative",
    },

    modeSwitch: {
      position:
        "absolute",

      top: 18,
      left: 16,

      zIndex: 100,
    },
  });
