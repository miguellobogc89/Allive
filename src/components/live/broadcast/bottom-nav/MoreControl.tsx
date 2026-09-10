// src/components/live/broadcast/bottom-nav/MoreControl.tsx

import { LiveControlButton } from "./LiveControlButton";

type MoreControlProps = {
  onPress: () => void;
};

export function MoreControl({ onPress }: MoreControlProps) {
  return (
    <LiveControlButton
      icon="ellipsis-horizontal"
      accessibilityLabel="Título y evento"
      onPress={onPress}
    />
  );
}
