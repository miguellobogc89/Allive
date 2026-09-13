import type {
  CameraType,
} from "expo-camera";

import {
  CameraView,
} from "expo-camera";

import {
  StyleSheet,
  View,
} from "react-native";

import {
  liveBroadcastSurfaceStyles as styles,
} from "./LiveBroadcastSurface.styles";

type LiveBroadcastNativeSurfaceProps = {
  facing: CameraType;
};

export function LiveBroadcastSurface({
  facing,
}: LiveBroadcastNativeSurfaceProps) {
  return (
    <View
      style={
        styles.container
      }
    >
      <CameraView
        style={
          StyleSheet.absoluteFill
        }
        facing={
          facing
        }
      />
    </View>
  );
}
