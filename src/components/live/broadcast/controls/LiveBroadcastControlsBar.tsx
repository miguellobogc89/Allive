// src/components/live/broadcast/controls/LiveBroadcastControlsBar.tsx

import { StyleSheet, View } from "react-native";

import { MoreControl } from "./MoreControl";
import { MicrophoneControl } from "./MicrophoneControl";
import { FiltersControl } from "./FiltersControl";
import { CameraSwitchControl } from "./CameraSwitchControl";
import { LiveBroadcastRecordButton } from "../overlay/LiveBroadcastRecordButton";

type LiveBroadcastControlsBarProps = {
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

export function LiveBroadcastControlsBar({
  isLive,
  isConnecting,
  cameraReady,
  microphoneEnabled,
  onOpenMetadata,
  onToggleMicrophone,
  onOpenFilters,
  onSwitchCamera,
  onStartLive,
  onFinishLive,
}: LiveBroadcastControlsBarProps) {
  return (
    <View style={styles.container}>
      <MoreControl onPress={onOpenMetadata} />

      <MicrophoneControl
        enabled={microphoneEnabled}
        onPress={onToggleMicrophone}
      />

      {!isLive ? (
        <LiveBroadcastRecordButton
          isLive={false}
          isConnecting={isConnecting}
          cameraReady={cameraReady}
          onStartLive={onStartLive}
          onFinishLive={onFinishLive}
        />
      ) : null}

      <FiltersControl onPress={onOpenFilters} />

      <CameraSwitchControl onPress={onSwitchCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 88,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(0,0,0,0.28)",
  },
});
