// src/screens/LiveBroadcastScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../theme/colors";

type LiveBroadcastScreenProps = {
  facing: CameraType;
  onFinish: () => void;
};

export function LiveBroadcastScreen({
  facing,
  onFinish,
}: LiveBroadcastScreenProps) {
  const [seconds, setSeconds] = useState(0);
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const viewerTimer = setInterval(() => {
      setViewers((current) => {
        if (current < 3) {
          return current + 1;
        }

        return current;
      });
    }, 2500);

    return () => clearInterval(viewerTimer);
  }, []);

  function formatDuration(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
      />

      <View style={styles.shade} />

      <View style={styles.top}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />

          <Text style={styles.liveText}>
            LIVE
          </Text>
        </View>

        <View style={styles.durationBadge}>
          <Text style={styles.duration}>
            {formatDuration(seconds)}
          </Text>
        </View>

        <View style={styles.viewerBadge}>
          <Ionicons
            name="eye-outline"
            size={15}
            color={colors.text}
          />

          <Text style={styles.viewerText}>
            {viewers}
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.location}>
          <Ionicons
            name="location"
            size={16}
            color={colors.text}
          />

          <Text style={styles.locationText}>
            Ubicación actual
          </Text>
        </View>

        <View style={styles.status}>
          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            Estás emitiendo ahora
          </Text>
        </View>

        <Pressable
          style={styles.finishButton}
          onPress={onFinish}
        >
          <View style={styles.stopIcon} />

          <Text style={styles.finishText}>
            FINALIZAR LIVE
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  shade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  top: {
    position: "absolute",

    top: 18,
    left: 18,
    right: 18,

    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },

  liveBadge: {
    height: 32,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    paddingHorizontal: 11,

    borderRadius: 10,

    backgroundColor: colors.live,
  },

  liveDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: colors.text,
  },

  liveText: {
    color: colors.text,

    fontSize: 11,
    fontWeight: "900",
  },

  durationBadge: {
    height: 32,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 11,

    borderRadius: 10,

    backgroundColor: "rgba(0,0,0,0.62)",
  },

  duration: {
    color: colors.text,

    fontSize: 12,
    fontWeight: "800",
  },

  viewerBadge: {
    height: 32,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    paddingHorizontal: 11,

    borderRadius: 10,

    backgroundColor: "rgba(0,0,0,0.62)",
  },

  viewerText: {
    color: colors.text,

    fontSize: 12,
    fontWeight: "700",
  },

  bottom: {
    position: "absolute",

    left: 22,
    right: 22,
    bottom: 125,

    alignItems: "center",
  },

  location: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 10,

    backgroundColor: "rgba(0,0,0,0.55)",
  },

  locationText: {
    color: colors.text,

    fontSize: 12,
    fontWeight: "700",
  },

  status: {
    marginTop: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: colors.live,
  },

  statusText: {
    color: "rgba(255,255,255,0.75)",

    fontSize: 11,
    fontWeight: "600",
  },

  finishButton: {
    height: 54,

    marginTop: 22,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 9,

    paddingHorizontal: 24,

    borderRadius: 18,

    backgroundColor: "rgba(15,15,15,0.88)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },

  stopIcon: {
    width: 12,
    height: 12,

    borderRadius: 3,

    backgroundColor: colors.live,
  },

  finishText: {
    color: colors.text,

    fontSize: 13,
    fontWeight: "900",
  },
});