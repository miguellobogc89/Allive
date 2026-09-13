// src/screens/NowScreen.web.tsx

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
  getActiveLives,
} from "../api/liveApi";

import {
  LiveModeSwitch,
} from "../components/live/shared";

import {
  AlliveLoadingScreen,
} from "../components/loading/AlliveLoadingScreen";

import type {
  ActiveLive,
} from "../components/live/types";

import {
  LiveViewerScreen,
} from "./LiveViewerScreen.web";

import {
  ReplayViewerScreen,
} from "./ReplayViewerScreen.web";

type NowMode =
  | "live"
  | "replay";

type NowScreenProps = {
  requestedLiveId?: string | null;
  requestedReplayId?: string | null;

  onOpenUser?: (
    userId: string,
  ) => void;
};

export function NowScreen({
  requestedLiveId = null,
  requestedReplayId = null,
  onOpenUser,
}: NowScreenProps) {
  const shouldResolveInitialMode =
    !requestedLiveId &&
    !requestedReplayId;

  const [
    mode,
    setMode,
  ] = useState<NowMode>(
    requestedReplayId
      ? "replay"
      : "live",
  );

  const [
    initialLives,
    setInitialLives,
  ] = useState<
    ActiveLive[]
  >([]);

  const [
    resolvingInitialMode,
    setResolvingInitialMode,
  ] = useState(
    shouldResolveInitialMode,
  );

  useEffect(() => {
    if (requestedReplayId) {
      setMode("replay");
      setInitialLives([]);
      setResolvingInitialMode(false);
      return;
    }

    if (requestedLiveId) {
      setMode("live");
      setInitialLives([]);
      setResolvingInitialMode(false);
      return;
    }

    const controller =
      new AbortController();

    setResolvingInitialMode(true);

    async function resolveInitialMode() {
      try {
        const lives =
          await getActiveLives(
            controller.signal,
          );

        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        setInitialLives(lives);

        setMode(
          lives.length > 0
            ? "live"
            : "replay",
        );
      } catch (error) {
        if (
          !controller.signal
            .aborted
        ) {
          console.error(
            "Allive NOW initial mode error:",
            error,
          );

          setInitialLives([]);
          setMode("replay");
        }
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setResolvingInitialMode(
            false,
          );
        }
      }
    }

    void resolveInitialMode();

    return () => {
      controller.abort();
    };
  }, [
    requestedLiveId,
    requestedReplayId,
  ]);

  const handleNoLivesAvailable =
    useCallback(() => {
      if (
        requestedLiveId ||
        requestedReplayId
      ) {
        return;
      }

      setMode("replay");
    }, [
      requestedLiveId,
      requestedReplayId,
    ]);

  if (resolvingInitialMode) {
    return (
      <AlliveLoadingScreen />
    );
  }

  return (
    <View style={styles.container}>
      {mode === "live" ? (
        <LiveViewerScreen
          requestedLiveId={
            requestedLiveId
          }
          initialLives={
            initialLives
          }
          onNoLivesAvailable={
            handleNoLivesAvailable
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
        style={styles.modeSwitch}
        pointerEvents="box-none"
      >
        <LiveModeSwitch
          mode={mode}
          onLivePress={() => {
            setMode("live");
          }}
          onReplayPress={() => {
            setMode("replay");
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
      position: "relative",
    },

    modeSwitch: {
      position: "absolute",

      top: 18,
      left: 16,

      zIndex: 100,
    },
  });
