// src/components/live/LiveBroadcastSurface.web.tsx

import { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../../styles";

type LiveBroadcastSurfaceProps = {
  cameraReady: boolean;
  cameraError: string | null;
};

export const LiveBroadcastSurface =
  forwardRef<
    HTMLDivElement,
    LiveBroadcastSurfaceProps
  >(function LiveBroadcastSurface(
    {
      cameraReady,
      cameraError,
    },
    ref
  ) {
    return (
      <View style={styles.container}>
        <div
          ref={ref}
          style={videoContainerStyle}
        />

        {!cameraReady && !cameraError ? (
          <View style={styles.status}>
            <Text style={styles.statusText}>
              Preparando cámara...
            </Text>
          </View>
        ) : null}

        {cameraError ? (
          <View style={styles.status}>
            <Text style={styles.errorText}>
              {cameraError}
            </Text>
          </View>
        ) : null}
      </View>
    );
  });

const videoContainerStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
} as const;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
  },

  status: {
    ...StyleSheet.absoluteFill,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,
  },

  statusText: {
    color: colors.text,
    fontSize: 14,
  },

  errorText: {
    color: colors.text,
    fontSize: 14,
    textAlign: "center",
  },
});
