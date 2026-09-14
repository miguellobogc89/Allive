// src/components/now/NowMapSection.web.tsx

import {
  MapScreen,
} from "../../maps/MapScreen.web";

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
