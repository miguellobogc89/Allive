// src/components/live/broadcast/bottom-nav/LiveBroadcastBottomNav.tsx

import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import {
  CameraSwitchControl,
} from "./CameraSwitchControl";

import {
  FiltersControl,
} from "./FiltersControl";

import {
  MicrophoneControl,
} from "./MicrophoneControl";

import {
  MoreControl,
} from "./MoreControl";

import {
  StopLiveControl,
} from "./StopLiveControl";

type LiveBroadcastBottomNavProps = {
  isLive: boolean;
  isConnecting: boolean;
  cameraReady: boolean;
  microphoneEnabled: boolean;

  onOpenMetadata: () => void;
  onToggleMicrophone: () => void;
  onOpenFilters: () => void;
  onSwitchCamera: () => void;
  onStartLive: () => void;
  onFinishLive: () => void;
};

export function LiveBroadcastBottomNav(
  props: LiveBroadcastBottomNavProps,
) {
  const {
    width,
    height,
  } = useWindowDimensions();

  const landscape =
    width > height;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.root,

        landscape
          ? styles.rootLandscape
          : styles.rootPortrait,
      ]}
    >
      <View
        style={[
          styles.controls,

          landscape
            ? styles.controlsLandscape
            : styles.controlsPortrait,
        ]}
      >
        <MoreControl
          onPress={
            props.onOpenMetadata
          }
        />

        <MicrophoneControl
          enabled={
            props.microphoneEnabled
          }
          onPress={
            props.onToggleMicrophone
          }
        />

        <StopLiveControl
          onPress={
            props.onFinishLive
          }
        />

        <FiltersControl
          onPress={
            props.onOpenFilters
          }
        />

        <CameraSwitchControl
          onPress={
            props.onSwitchCamera
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 20,

    justifyContent: "flex-end",
  },

  rootPortrait: {
    height: 104,
  },

  rootLandscape: {
    height: 94,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
  },

  controlsPortrait: {
    width: "100%",

    minHeight: 86,

    paddingHorizontal: 18,
    paddingBottom: 18,

    justifyContent:
      "space-around",
  },

  controlsLandscape: {
    width: "55%",

    minHeight: 82,

    marginLeft: "45%",

    paddingHorizontal: 20,
    paddingBottom: 14,

    justifyContent:
      "space-around",
  },
});