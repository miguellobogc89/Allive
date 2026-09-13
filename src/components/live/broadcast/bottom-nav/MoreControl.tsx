// src/components/live/broadcast/bottom-nav/MoreControl.tsx

import {
  LiveControlButton,
} from "./LiveControlButton";

type MoreControlProps = {
  onPress: () => void;
  disabled?: boolean;
};

export function MoreControl({
  onPress,
  disabled = false,
}: MoreControlProps) {
  return (
    <LiveControlButton
      icon="ellipsis-horizontal"
      accessibilityLabel="Título y evento"
      onPress={onPress}
      disabled={disabled}
    />
  );
}
