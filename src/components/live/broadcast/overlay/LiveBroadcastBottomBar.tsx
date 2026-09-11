// src/components/live/broadcast/overlay/LiveBroadcastBottomBar.tsx

import {
  LiveBroadcastBottomNav,
} from "../bottom-nav";

type LiveBroadcastBottomBarProps = {
  isLive: boolean;
  isConnecting: boolean;
  cameraReady: boolean;
  microphoneEnabled: boolean;

  onOpenMore: () => void;
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
    <LiveBroadcastBottomNav
      {...props}
    />
  );
}