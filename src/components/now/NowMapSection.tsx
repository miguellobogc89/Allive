// src/components/now/NowMapSection.tsx

import {
  MapScreen,
} from "../../maps/MapScreen";

type NowMapSectionProps = {
  onOpenLive?: (
    liveId: string,
  ) => void;
  onOpenReplay?: (
    replayId: string,
  ) => void;
};

export function NowMapSection({
  onOpenLive,
  onOpenReplay,
}: NowMapSectionProps) {
  return (
    <MapScreen
      onOpenLive={onOpenLive}
      onOpenReplay={onOpenReplay}
    />
  );
}
