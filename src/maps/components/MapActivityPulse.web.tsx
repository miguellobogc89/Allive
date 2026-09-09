// src/maps/components/MapActivityPulse.web.tsx

import { useEffect, useRef } from "react";

import type {
  LeafletGlobal,
  LeafletMap,
  LeafletMarker,
} from "../web/leafletTypes";
import type { MappedLive } from "../types/mapTypes";

type MapActivityPulseProps = {
  leaflet: LeafletGlobal | null;
  map: LeafletMap | null;
  live: MappedLive;
  onPress: (live: MappedLive) => void;
};

export function MapActivityPulse({
  leaflet,
  map,
  live,
  onPress,
}: MapActivityPulseProps) {
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (!leaflet || !map) {
      return;
    }

    const icon = leaflet.divIcon({
      className: "allive-map-pulse-icon",
      html: '<div class="allive-map-pulse"></div>',
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const marker = leaflet
      .marker(
        [live.latitude, live.longitude],
        { icon },
      )
      .addTo(map)
      .on("click", () => onPress(live));

    markerRef.current = marker;

    return () => {
      marker.remove();
      markerRef.current = null;
    };
  }, [
    leaflet,
    map,
    live.id,
    live.latitude,
    live.longitude,
    onPress,
  ]);

  return null;
}
