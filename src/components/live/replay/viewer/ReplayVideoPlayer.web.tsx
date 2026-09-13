import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  View,
} from "react-native";

import {
  replayViewerStyles as styles,
} from "./ReplayViewerScreen.styles";

import type {
  ReplayVideoPlayerProps,
} from "./ReplayVideoPlayer.types";

const videoStyle:
  CSSProperties = {
    position:
      "absolute",

    inset: 0,

    width: "100%",

    height: "100%",

    objectFit:
      "cover",
  };

export function ReplayVideoPlayer({
  replay,
  children,
}: ReplayVideoPlayerProps) {
  const videoRef =
    useRef<
      HTMLVideoElement | null
    >(null);

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

  useEffect(() => {
    setPaused(false);
    setMuted(false);
    setCurrentTime(0);
    setDuration(0);
  }, [
    replay.id,
  ]);

  const togglePlayback =
    useCallback(() => {
      const video =
        videoRef.current;

      if (!video) {
        return;
      }

      if (
        video.paused
      ) {
        void video.play();
        return;
      }

      video.pause();
    }, []);

  const seekTo =
    useCallback(
      (
        time: number,
      ) => {
        const video =
          videoRef.current;

        if (!video) {
          return;
        }

        const videoDuration =
          Number.isFinite(
            video.duration,
          )
            ? Math.max(
                0,
                video.duration,
              )
            : 0;

        const nextTime =
          Math.min(
            Math.max(
              time,
              0,
            ),
            videoDuration ||
              Math.max(
                0,
                time,
              ),
          );

        video.currentTime =
          nextTime;

        setCurrentTime(
          nextTime,
        );
      },
      [],
    );

  const skipBackward =
    useCallback(() => {
      const video =
        videoRef.current;

      if (!video) {
        return;
      }

      seekTo(
        video.currentTime -
          10,
      );
    }, [
      seekTo,
    ]);

  const skipForward =
    useCallback(() => {
      const video =
        videoRef.current;

      if (!video) {
        return;
      }

      seekTo(
        video.currentTime +
          15,
      );
    }, [
      seekTo,
    ]);

  const toggleMute =
    useCallback(() => {
      const video =
        videoRef.current;

      if (!video) {
        return;
      }

      video.muted =
        !video.muted;

      setMuted(
        video.muted,
      );
    }, []);

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.media
        }
      >
        <video
          ref={
            videoRef
          }
          key={
            replay.id
          }
          src={
            replay.recordingUrl
          }
          autoPlay
          playsInline
          controls={
            false
          }
          onTimeUpdate={(
            event,
          ) => {
            setCurrentTime(
              event.currentTarget
                .currentTime,
            );
          }}
          onLoadedMetadata={(
            event,
          ) => {
            setDuration(
              Number.isFinite(
                event.currentTarget
                  .duration,
              )
                ? event.currentTarget
                    .duration
                : 0,
            );

            setMuted(
              event.currentTarget
                .muted,
            );
          }}
          onDurationChange={(
            event,
          ) => {
            setDuration(
              Number.isFinite(
                event.currentTarget
                  .duration,
              )
                ? event.currentTarget
                    .duration
                : 0,
            );
          }}
          onPlay={() => {
            setPaused(false);
          }}
          onPause={() => {
            setPaused(true);
          }}
          onEnded={() => {
            setPaused(true);
          }}
          onVolumeChange={(
            event,
          ) => {
            setMuted(
              event.currentTarget
                .muted,
            );
          }}
          style={
            videoStyle
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
    </View>
  );
}
