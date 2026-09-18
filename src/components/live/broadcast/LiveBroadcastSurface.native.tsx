import type {
  CameraType,
  CameraMountError,
} from "expo-camera";

import {
  CameraView,
} from "expo-camera";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  liveBroadcastSurfaceStyles as styles,
} from "./LiveBroadcastSurface.styles";

type LiveBroadcastNativeSurfaceProps = {
  facing: CameraType;
  cameraReady: boolean;
  cameraError: string | null;
  onCameraReady: () => void;
  onMountError: (error: CameraMountError) => void;
};

export function LiveBroadcastSurface({
  facing,
  cameraReady,
  cameraError,
  onCameraReady,
  onMountError,
}: LiveBroadcastNativeSurfaceProps) {
  return (
    <View
      style={
        styles.container
      }
    >
      <CameraView
        key={facing}
        onCameraReady={onCameraReady}
        onMountError={onMountError}
        style={
          StyleSheet.absoluteFill
        }
        facing={
          facing
        }
      />
      {!cameraReady && (
        <View style={styles.status} pointerEvents="none">
          <Text style={cameraError ? styles.errorText : styles.statusText}>
            {cameraError ?? "Preparando cámara..."}
          </Text>
        </View>
      )}
    </View>
  );
}
