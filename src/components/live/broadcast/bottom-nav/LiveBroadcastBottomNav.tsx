// src/components/live/broadcast/bottom-nav/LiveBroadcastBottomNav.tsx

import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { LiveBroadcastRecordButton } from "../overlay/LiveBroadcastRecordButton";
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

  const controls = (
    <>
      <MoreControl onPress={props.onOpenMetadata} />
      <MicrophoneControl
        enabled={props.microphoneEnabled}
        onPress={props.onToggleMicrophone}
      />

      {!props.isLive ? (
        <LiveBroadcastRecordButton
          isLive={false}
          isConnecting={props.isConnecting}
          cameraReady={props.cameraReady}
          onStartLive={props.onStartLive}
          onFinishLive={props.onFinishLive}
        />
      ) : (
        <View style={styles.recordPlaceholder} />
      )}

      <FiltersControl onPress={props.onOpenFilters} />
      <CameraSwitchControl onPress={props.onSwitchCamera} />
    </>
  );

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
        colors={
          landscape
            ? [
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0.20)",
                "rgba(0,0,0,0.72)",
                "rgba(0,0,0,0.96)",
              ]
            : [
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0.18)",
                "rgba(0,0,0,0.70)",
                "rgba(0,0,0,0.96)",
              ]
        }
        locations={[0, 0.32, 0.72, 1]}
        start={landscape ? { x: 0, y: 0.5 } : { x: 0.5, y: 0 }}
        end={landscape ? { x: 1, y: 0.5 } : { x: 0.5, y: 1 }}
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
        {controls}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    zIndex: 20,
  },

  rootPortrait: {
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    justifyContent: "flex-end",
  },

  rootLandscape: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 150,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  controls: {
    alignItems: "center",
    justifyContent: "space-between",
  },

  controlsPortrait: {
    width: "100%",
    height: 82,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
  },

  controlsLandscape: {
    width: 82,
    height: 330,
    marginRight: 18,
    paddingVertical: 8,
    flexDirection: "column",
  },

  recordPlaceholder: {
    width: 76,
    height: 76,
  },
});
