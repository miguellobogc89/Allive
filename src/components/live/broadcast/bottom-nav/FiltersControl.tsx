// src/components/live/broadcast/bottom-nav/FiltersControl.tsx

import {
  LiveControlButton,
} from "./LiveControlButton";

type FiltersControlProps = {
  onPress: () => void;
  disabled?: boolean;
};

export function FiltersControl({
  onPress,
  disabled = false,
}: FiltersControlProps) {
  return (
    <LiveControlButton
      icon="color-wand-outline"
      accessibilityLabel="Filtros"
      onPress={onPress}
      disabled={disabled}
    />
  );
}
