// src/components/live/broadcast/bottom-nav/CameraSwitchControl.tsx

import { LiveControlButton } from "./LiveControlButton";

type CameraSwitchControlProps = {
  onPress: () => void;
};

export function CameraSwitchControl({
  onPress,
}: CameraSwitchControlProps) {
  return (
    <LiveControlButton
      icon="camera-reverse-outline"
      accessibilityLabel="Cambiar cámara"
      onPress={onPress}
    />
  );
}
