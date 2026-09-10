// src/components/live/broadcast/overlay/LiveBroadcastOverlay.tsx

import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { LiveBroadcastHeader } from "../header";
import { LiveBroadcastBottomBar } from "./LiveBroadcastBottomBar";
import { LiveBroadcastMetadataModal } from "./LiveBroadcastMetadataModal";
import { LiveBroadcastError } from "./LiveBroadcastError";

type LiveBroadcastOverlayProps = {
  isLive: boolean;
  isConnecting: boolean;
  cameraReady: boolean;
  viewers?: number;
  likes?: number;
  error: string | null;

  title?: string;
  eventName?: string;
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
  error,
  title = "",
  eventName = "",
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
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleBackgroundPress}
      />

      <LiveBroadcastError message={error} />

      {controlsVisible ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.controlsLayer,
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <LiveBroadcastHeader
            isLive={isLive}
            viewers={viewers}
            likes={likes}
            onFinishLive={onFinishLive}
          />

          <LiveBroadcastBottomBar
            isLive={isLive}
            isConnecting={isConnecting}
            cameraReady={cameraReady}
            microphoneEnabled={microphoneEnabled}
            onOpenMetadata={openMetadata}
            onToggleMicrophone={
              onToggleMicrophone ?? (() => {})
            }
            onOpenFilters={
              onOpenFilters ?? (() => {})
            }
            onSwitchCamera={
              onSwitchCamera ?? (() => {})
            }
            onStartLive={onStartLive}
            onFinishLive={onFinishLive}
          />
        </Animated.View>
      ) : null}

      <LiveBroadcastMetadataModal
        visible={metadataVisible}
        title={title}
        eventName={eventName}
        onChangeTitle={
          onChangeTitle ?? (() => {})
        }
        onChangeEventName={
          onChangeEventName ?? (() => {})
        }
        onCancel={() => closeMetadata(false)}
        onSave={() => closeMetadata(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },
  controlsLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
  },
});
