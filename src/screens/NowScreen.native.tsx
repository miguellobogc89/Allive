// src/screens/NowScreen.native.tsx

import {
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
  LiveViewerScreen,
} from "./LiveViewerScreen.native";

import {
  ReplayViewerScreen,
} from "./ReplayViewerScreen.native";

type NowMode =
  | "live"
  | "replay";

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

  return (
    <View
      style={
        styles.container
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
        />
      ) : (
        <ReplayViewerScreen
          requestedReplayId={
            requestedReplayId
          }
          onOpenUser={
            onOpenUser
          }
        />
      )}

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