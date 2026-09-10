// src/components/live/broadcast/overlay/LiveBroadcastBottomBar.tsx

import { StyleSheet, View } from "react-native";

import { LiveBroadcastControlsBar } from "../controls/LiveBroadcastControlsBar";

type LiveBroadcastBottomBarProps = {
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

export function LiveBroadcastBottomBar(
  props: LiveBroadcastBottomBarProps,
) {
  return (
    <View pointerEvents="box-none" style={styles.container}>
      <LiveBroadcastControlsBar {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
});
