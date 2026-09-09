// src/components/live/LiveBroadcastControls.tsx

import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, controls, layout, typography } from "../../styles";

type LiveBroadcastControlsProps = {
  isLive: boolean;
  isConnecting: boolean;
  cameraReady: boolean;
  liveRoomName: string | null;
  onStartLive: () => void;
  onFinishLive: () => void;
};

export function LiveBroadcastControls({
  isLive,
  isConnecting,
  cameraReady,
  liveRoomName,
  onStartLive,
  onFinishLive,
}: LiveBroadcastControlsProps) {
  return (
    <View style={styles.container}>
      {!isLive ? (
        <Pressable
          style={[
            styles.goLiveButton,
            (!cameraReady || isConnecting) && styles.disabledButton,
          ]}
          disabled={!cameraReady || isConnecting}
          onPress={onStartLive}
        >
          <View style={styles.goLiveDot} />
          <Text style={styles.goLiveText}>
            {isConnecting ? "CONECTANDO..." : "EMPEZAR LIVE"}
          </Text>
        </Pressable>
      ) : (
        <Pressable style={styles.finishButton} onPress={onFinishLive}>
          <View style={styles.stopIcon} />
          <Text style={styles.finishText}>FINALIZAR LIVE</Text>
        </Pressable>
      )}

      <Text style={styles.hint}>
        {isLive
          ? "Estás en directo"
          : cameraReady
            ? "La cámara está preparada · todavía no estás en directo"
            : isConnecting
              ? "Conectando con Allive..."
              : "Preparando cámara"}
      </Text>

      {isLive && liveRoomName ? (
        <Text style={styles.roomText}>{liveRoomName}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: layout.broadcastControlsBottom,
    alignItems: "center",
    zIndex: 20,
  },
  goLiveButton: {
    height: controls.primaryButtonHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 30,
    borderRadius: 18,
    backgroundColor: colors.live,
  },
  disabledButton: {
    opacity: 0.5,
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
  finishButton: {
    height: controls.primaryButtonHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 28,
    borderRadius: 18,
    backgroundColor: "rgba(20,20,20,0.9)",
    borderWidth: 1,
    borderColor: colors.borderOnOverlaySubtle,
  },
  stopIcon: {
    width: controls.stopIconSize,
    height: controls.stopIconSize,
    borderRadius: 3,
    backgroundColor: colors.live,
  },
  finishText: {
    color: colors.text,
    fontSize: typography.caption.fontSize + 2,
    fontWeight: "900",
  },
  hint: {
    marginTop: 9,
    color: colors.textOnOverlayPlaceholder,
    fontSize: 10,
    fontWeight: "500",
  },
  roomText: {
    marginTop: 3,
    color: colors.textOnOverlayFaint,
    ...typography.micro,
    fontWeight: "400",
  },
});
