// src/components/live/replay/viewer/ReplayVideoPlayer.native.tsx

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  View,
} from "react-native";

import {
  VideoView,
  useVideoPlayer,
} from "expo-video";

import {
  replayViewerStyles as styles,
} from "./ReplayViewerScreen.styles";

import type {
  ReplayVideoPlayerProps,
} from "./ReplayVideoPlayer.types";

export function ReplayVideoPlayer({
  replay,
  children,
}: ReplayVideoPlayerProps) {
  const [
    paused,
    setPaused,
  ] = useState(false);

  const [
    muted,
    setMuted,
  ] = useState(false);

  const [
    currentTime,
    setCurrentTime,
  ] = useState(0);

  const [
    duration,
    setDuration,
  ] = useState(0);

  const player =
    useVideoPlayer(
      replay.recordingUrl,
      (
        videoPlayer,
      ) => {
        videoPlayer.loop =
          false;

        videoPlayer.play();
      },
    );

  useEffect(() => {
    setPaused(false);

    setMuted(
      player.muted,
    );

    setCurrentTime(0);

    const interval =
      setInterval(() => {
        setCurrentTime(
          Number.isFinite(
            player.currentTime,
          )
            ? player.currentTime
            : 0,
        );

        setDuration(
          Number.isFinite(
            player.duration,
          )
            ? player.duration
            : 0,
        );

        setMuted(
          player.muted,
        );

        setPaused(
          !player.playing,
        );
      }, 250);

    return () => {
      clearInterval(
        interval,
      );
    };
  }, [
    player,
    replay.id,
  ]);

  const togglePlayback =
    useCallback(() => {
      if (
        player.playing
      ) {
        player.pause();

        setPaused(true);

        return;
      }

      player.play();

      setPaused(false);
    }, [
      player,
    ]);

  const seekTo =
    useCallback(
      (
        time: number,
      ) => {
        const maxDuration =
          Number.isFinite(
            player.duration,
          )
            ? Math.max(
                0,
                player.duration,
              )
            : 0;

        const nextTime =
          Math.min(
            Math.max(
              time,
              0,
            ),
            maxDuration ||
              Math.max(
                0,
                time,
              ),
          );

        player.currentTime =
          nextTime;

        setCurrentTime(
          nextTime,
        );
      },
      [
        player,
      ],
    );

  const skipBackward =
    useCallback(() => {
      seekTo(
        player.currentTime -
          15,
      );
    }, [
      player,
      seekTo,
    ]);

  const skipForward =
    useCallback(() => {
      seekTo(
        player.currentTime +
          15,
      );
    }, [
      player,
      seekTo,
    ]);

  const toggleMute =
    useCallback(() => {
      const nextMuted =
        !player.muted;

      player.muted =
        nextMuted;

      setMuted(
        nextMuted,
      );
    }, [
      player,
    ]);

  return (
    <View
      style={
        styles.container
      }
    >
      <VideoView
        key={
          replay.id
        }
        player={
          player
        }
        style={
          styles.video
        }
        contentFit="cover"
        nativeControls={
          false
        }
      />

      {children({
        currentTime,
        duration,
        muted,
        paused,
        seekTo,
        skipBackward,
        skipForward,
        toggleMute,
        togglePlayback,
      })}
    </View>
  );
}