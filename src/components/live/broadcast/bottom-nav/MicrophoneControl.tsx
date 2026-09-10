// src/components/live/broadcast/bottom-nav/MicrophoneControl.tsx

import { LiveControlButton } from "./LiveControlButton";

type MicrophoneControlProps = {
  enabled: boolean;
  onPress: () => void;
};

export function MicrophoneControl({
  enabled,
  onPress,
}: MicrophoneControlProps) {
  return (
    <LiveControlButton
      icon={enabled ? "mic" : "mic-off"}
      accessibilityLabel={
        enabled ? "Silenciar micrófono" : "Activar micrófono"
      }
      onPress={onPress}
      danger={!enabled}
    />
  );
}
