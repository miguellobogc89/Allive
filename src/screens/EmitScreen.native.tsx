// src/screens/EmitScreen.native.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LiveBroadcastScreen } from "./LiveBroadcastScreen";

import { colors } from "../theme/colors";

export function EmitScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isLive, setIsLive] = useState(false);

  function toggleCamera() {
    setFacing((current) =>
      current === "back" ? "front" : "back"
    );
  }

  if (!permission) {
    return (
      <View style={styles.permissionScreen}>
        <Text style={styles.permissionText}>
          Preparando cámara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <View style={styles.permissionIcon}>
          <Ionicons
            name="videocam-outline"
            size={34}
            color={colors.text}
          />
        </View>

        <Text style={styles.permissionTitle}>
          Allive necesita tu cámara
        </Text>

        <Text style={styles.permissionText}>
          La cámara es necesaria para poder emitir en directo.
        </Text>

        <Pressable
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>
            PERMITIR CÁMARA
          </Text>
        </Pressable>
      </View>
    );
  }

  if (isLive) {
  return (
    <LiveBroadcastScreen
      facing={facing}
      onFinish={() => setIsLive(false)}
    />
  );
}

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
      />

      <View style={styles.cameraShade} />

      <View style={styles.top}>
        <Pressable style={styles.circleButton}>
          <Ionicons
            name="close"
            size={25}
            color={colors.text}
          />
        </Pressable>

        <View style={styles.readyBadge}>
          <View style={styles.readyDot} />
          <Text style={styles.readyText}>LISTO</Text>
        </View>

        <Pressable
          style={styles.circleButton}
          onPress={toggleCamera}
        >
          <Ionicons
            name="camera-reverse-outline"
            size={23}
            color={colors.text}
          />
        </Pressable>
      </View>

      <View style={styles.bottom}>
        <View style={styles.context}>
          <View style={styles.locationRow}>
            <Ionicons
              name="location"
              size={17}
              color={colors.text}
            />

            <Text style={styles.location}>
              Ubicación actual
            </Text>
          </View>

          <Text style={styles.contextText}>
            Allive detectará dónde estás y qué está pasando cerca.
          </Text>
        </View>

        <Pressable
            style={styles.goLiveButton}
            onPress={() => setIsLive(true)}
            >
          <View style={styles.goLiveDot} />

          <Text style={styles.goLiveText}>
            EMPEZAR LIVE
          </Text>
        </Pressable>

        <Text style={styles.hint}>
          Estarás en directo inmediatamente
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050506",
  },

  cameraShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  permissionScreen: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 32,

    backgroundColor: colors.background,
  },

  permissionIcon: {
    width: 68,
    height: 68,

    borderRadius: 34,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,

    backgroundColor: colors.surfaceElevated,
  },

  permissionTitle: {
    color: colors.text,

    fontSize: 20,
    fontWeight: "900",

    textAlign: "center",
  },

  permissionText: {
    marginTop: 8,

    color: colors.textSecondary,

    fontSize: 13,
    lineHeight: 19,

    textAlign: "center",
  },

  permissionButton: {
    height: 50,

    marginTop: 24,

    paddingHorizontal: 24,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.live,
  },

  permissionButtonText: {
    color: colors.text,

    fontSize: 12,
    fontWeight: "900",
  },

  top: {
    position: "absolute",

    top: 18,
    left: 18,
    right: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  circleButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(0,0,0,0.55)",
  },

  readyBadge: {
    height: 32,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    paddingHorizontal: 11,

    borderRadius: 10,

    backgroundColor: "rgba(0,0,0,0.55)",
  },

  readyDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: colors.live,
  },

  readyText: {
    color: colors.text,

    fontSize: 11,
    fontWeight: "800",
  },

  bottom: {
    position: "absolute",

    left: 22,
    right: 22,
    bottom: 125,

    alignItems: "center",
  },

  context: {
    width: "100%",

    marginBottom: 22,

    padding: 14,

    borderRadius: 14,

    backgroundColor: "rgba(0,0,0,0.55)",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  location: {
    color: colors.text,

    fontSize: 15,
    fontWeight: "800",
  },

  contextText: {
    marginTop: 5,

    color: "rgba(255,255,255,0.65)",

    fontSize: 12,
    lineHeight: 17,
  },

  goLiveButton: {
    height: 56,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 9,

    paddingHorizontal: 28,

    borderRadius: 18,

    backgroundColor: colors.live,
  },

  goLiveDot: {
    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor: colors.text,
  },

  goLiveText: {
    color: colors.text,

    fontSize: 15,
    fontWeight: "900",
  },

  hint: {
    marginTop: 9,

    color: "rgba(255,255,255,0.48)",

    fontSize: 10,
    fontWeight: "500",
  },
});