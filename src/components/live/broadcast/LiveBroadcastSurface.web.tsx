// src/components/live/broadcast/LiveBroadcastSurface.web.tsx

import { forwardRef } from "react";
import { Text, View } from "react-native";

import {
  liveBroadcastSurfaceStyles as styles,
} from "./LiveBroadcastSurface.styles";

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
