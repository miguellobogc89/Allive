// src/components/live/broadcast/bottom-nav/LiveBroadcastBottomNav.tsx

import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { CameraSwitchControl } from "./CameraSwitchControl";
import { FiltersControl } from "./FiltersControl";
import { MicrophoneControl } from "./MicrophoneControl";
import { MoreControl } from "./MoreControl";

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
  const { width, height } = useWindowDimensions();
  const landscape = width > height;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.root,
        landscape ? styles.rootLandscape : styles.rootPortrait,
      ]}
    >
      <LinearGradient
        pointerEvents="none"
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.16)",
          "rgba(0,0,0,0.62)",
          "rgba(0,0,0,0.94)",
        ]}
        locations={[0, 0.30, 0.70, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.controls,
          landscape
            ? styles.controlsLandscape
            : styles.controlsPortrait,
        ]}
      >
        <MoreControl onPress={props.onOpenMetadata} />

        <MicrophoneControl
          enabled={props.microphoneEnabled}
          onPress={props.onToggleMicrophone}
        />

        <FiltersControl onPress={props.onOpenFilters} />

        <CameraSwitchControl onPress={props.onSwitchCamera} />
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
    height: 150,
  },

  rootLandscape: {
    height: 118,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
  },

  controlsPortrait: {
    width: "100%",
    minHeight: 82,
    paddingHorizontal: 20,
    paddingBottom: 18,
    justifyContent: "space-around",
  },

  controlsLandscape: {
    width: "50%",
    minHeight: 82,
    marginLeft: "50%",
    paddingHorizontal: 22,
    paddingBottom: 14,
    justifyContent: "space-around",
  },
});
