// src/components/live/broadcast/bottom-nav/CameraSwitchControl.tsx

import {
  LiveControlButton,
} from "./LiveControlButton";

type CameraSwitchControlProps = {
  onPress: () => void;
  disabled?: boolean;
};

export function CameraSwitchControl({
  onPress,
  disabled = false,
}: CameraSwitchControlProps) {
  return (
    <LiveControlButton
      icon="camera-reverse-outline"
      accessibilityLabel="Cambiar cámara"
      onPress={onPress}
      disabled={disabled}
    />
  );
}
