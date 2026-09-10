// src/components/live/broadcast/overlay/LiveBroadcastRecordButton.tsx

import { Pressable, StyleSheet, View } from "react-native";

type LiveBroadcastRecordButtonProps = {
  isLive: boolean;
  isConnecting: boolean;
  cameraReady: boolean;
  onStartLive: () => void;
  onFinishLive: () => void;
};

export function LiveBroadcastRecordButton({
  isLive,
  isConnecting,
  cameraReady,
  onStartLive,
  onFinishLive,
}: LiveBroadcastRecordButtonProps) {
  const disabled =
    isConnecting || (!isLive && !cameraReady);

  return (
    <Pressable
      accessibilityLabel={
        isLive ? "Finalizar LIVE" : "Iniciar LIVE"
      }
      accessibilityRole="button"
      disabled={disabled}
      onPress={isLive ? onFinishLive : onStartLive}
      style={({ pressed }) => [
        styles.outer,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.inner,
          isLive && styles.stop,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  inner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF3344",
  },
  stop: {
    width: 30,
    height: 30,
    borderRadius: 7,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
});
