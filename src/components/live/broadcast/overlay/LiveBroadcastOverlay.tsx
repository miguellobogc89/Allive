// src/components/live/broadcast/overlay/LiveBroadcastOverlay.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type { LiveCommentModel } from "../../comments/liveCommentTypes";
import { LiveTimedCommentsLayer } from "../../comments/LiveTimedCommentsLayer";
import { LiveBroadcastBottomNav } from "../bottom-nav";
import { LiveBroadcastHeader } from "../header";
import { LiveBroadcastMetadata } from "../metadata/LiveBroadcastMetadata";
import { LiveBroadcastError } from "./LiveBroadcastError";
import { LiveBroadcastMetadataModal } from "./LiveBroadcastMetadataModal";

type LiveBroadcastOverlayProps = {
  isLive: boolean;
  isConnecting: boolean;
  cameraReady: boolean;
  viewers?: number;
  likes?: number;
  comments?: LiveCommentModel[];
  error: string | null;

  title?: string;
  eventName?: string;
  locationName?: string | null;
  microphoneEnabled?: boolean;

  onChangeTitle?: (value: string) => void;
  onChangeEventName?: (value: string) => void;
  onSaveMetadata?: () => void;
  onToggleMicrophone?: () => void;
  onOpenFilters?: () => void;
  onSwitchCamera?: () => void;

  onStartLive: () => void;
  onFinishLive: () => void;
};

export function LiveBroadcastOverlay({
  isLive,
  isConnecting,
  cameraReady,
  viewers = 0,
  likes = 0,
  comments = [],
  error,
  title = "",
  eventName = "",
  locationName = null,
  microphoneEnabled = true,
  onChangeTitle,
  onChangeEventName,
  onSaveMetadata,
  onToggleMicrophone,
  onOpenFilters,
  onSwitchCamera,
  onStartLive,
  onFinishLive,
}: LiveBroadcastOverlayProps) {
  const [controlsVisible, setControlsVisible] =
    useState(true);

  const [metadataVisible, setMetadataVisible] =
    useState(false);

  const opacity =
    useRef(new Animated.Value(1)).current;

  const translateY =
    useRef(new Animated.Value(0)).current;

  function hideControls() {
    if (!controlsVisible || metadataVisible) {
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 32,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setControlsVisible(false);
    });
  }

  function showControls() {
    if (controlsVisible) {
      return;
    }

    setControlsVisible(true);
    opacity.setValue(0);
    translateY.setValue(42);

    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  function handleBackgroundPress() {
    if (metadataVisible) {
      return;
    }

    if (controlsVisible) {
      hideControls();
      return;
    }

    showControls();
  }

  function openMetadata() {
    setMetadataVisible(true);
  }

  function closeMetadata(save: boolean) {
    setMetadataVisible(false);

    if (save) {
      onSaveMetadata?.();
    }
  }

  return (
    <View
      pointerEvents="box-none"
      style={styles.overlay}
    >
      {isLive ? (
        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0.08)",
            "rgba(0,0,0,0.22)",
            "rgba(0,0,0,0.48)",
          ]}
          locations={[
            0,
            0.35,
            0.7,
            1,
          ]}
          style={styles.bottomGradient}
        />
      ) : null}

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleBackgroundPress}
      />

      <LiveBroadcastError
        message={error}
      />

      <LiveTimedCommentsLayer
        comments={comments}
        visible={isLive}
      />

      {controlsVisible ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.controlsLayer,
            {
              opacity,
              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}
        >
          <LiveBroadcastHeader
            isLive={isLive}
            viewers={viewers}
            likes={likes}
            onFinishLive={
              onFinishLive
            }
          />

          {isLive &&
          (eventName.trim() ||
            title.trim() ||
            locationName) ? (
            <View
              pointerEvents="none"
              style={styles.topMetadata}
            >
              <LiveBroadcastMetadata
                eventName={eventName}
                title={title}
                location={locationName}
              />
            </View>
          ) : null}

          {isLive ? (
            <LiveBroadcastBottomNav
              isLive={isLive}
              isConnecting={
                isConnecting
              }
              cameraReady={
                cameraReady
              }
              microphoneEnabled={
                microphoneEnabled
              }
              onOpenMetadata={
                openMetadata
              }
              onToggleMicrophone={
                onToggleMicrophone ??
                (() => {})
              }
              onOpenFilters={
                onOpenFilters ??
                (() => {})
              }
              onSwitchCamera={
                onSwitchCamera ??
                (() => {})
              }
              onStartLive={
                onStartLive
              }
              onFinishLive={
                onFinishLive
              }
            />
          ) : null}
        </Animated.View>
      ) : null}

      <LiveBroadcastMetadataModal
        visible={metadataVisible}
        title={title}
        eventName={eventName}
        onChangeTitle={
          onChangeTitle ??
          (() => {})
        }
        onChangeEventName={
          onChangeEventName ??
          (() => {})
        }
        onCancel={() =>
          closeMetadata(false)
        }
        onSave={() =>
          closeMetadata(true)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },

  bottomGradient: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    height: 190,
  },

  controlsLayer: {
    ...StyleSheet.absoluteFill,

    justifyContent: "flex-end",
  },

  topMetadata: {
    position: "absolute",

    top: 70,
    left: 18,
    right: 96,

    zIndex: 24,
  },
});