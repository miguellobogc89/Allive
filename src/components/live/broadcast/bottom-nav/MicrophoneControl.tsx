// src/components/live/broadcast/bottom-nav/MicrophoneControl.tsx

import {
  LiveControlButton,
} from "./LiveControlButton";

type MicrophoneControlProps = {
  enabled: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function MicrophoneControl({
  enabled,
  onPress,
  disabled = false,
}: MicrophoneControlProps) {
  return (
    <LiveControlButton
      icon={enabled ? "mic" : "mic-off"}
      accessibilityLabel={
        enabled
          ? "Silenciar micrófono"
          : "Activar micrófono"
      }
      onPress={onPress}
      danger={!enabled}
      disabled={disabled}
    />
  );
}
