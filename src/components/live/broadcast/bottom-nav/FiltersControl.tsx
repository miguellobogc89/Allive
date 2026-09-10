// src/components/live/broadcast/bottom-nav/FiltersControl.tsx

import { LiveControlButton } from "./LiveControlButton";

type FiltersControlProps = {
  onPress: () => void;
};

export function FiltersControl({ onPress }: FiltersControlProps) {
  return (
    <LiveControlButton
      icon="color-wand-outline"
      accessibilityLabel="Filtros"
      onPress={onPress}
    />
  );
}
