// src/components/live/broadcast/LiveBroadcastSurface.web.tsx

import { forwardRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../styles";

type LiveBroadcastSurfaceProps = {
  cameraReady: boolean;
  cameraError: string | null;
};

export const LiveBroadcastSurface =
  forwardRef<HTMLDivElement, LiveBroadcastSurfaceProps>(
    function LiveBroadcastSurface(
      { cameraReady, cameraError },
      ref,
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
    },
  );

const videoContainerStyle = {
  position: "absolute" as const,
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden" as const,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.cameraBackground,
  },
  status: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});
