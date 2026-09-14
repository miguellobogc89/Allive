// src/maps/components/MapActivityPulse.web.tsx

import {
  useEffect,
  useRef,
} from "react";

import type {
  LeafletGlobal,
  LeafletMap,
  LeafletMarker,
} from "../web/leafletTypes";

import type {
  MapContentGroup,
} from "../types/mapTypes";

type MapActivityPulseProps = {
  leaflet: LeafletGlobal | null;
  map: LeafletMap | null;
  group: MapContentGroup;
  onPress: (
    group: MapContentGroup,
  ) => void;
};

export function MapActivityPulse({
  leaflet,
  map,
  group,
  onPress,
}: MapActivityPulseProps) {
  const markerRef =
    useRef<LeafletMarker | null>(
      null,
    );

  useEffect(() => {
    if (!leaflet || !map) {
      return;
    }

    const hasLive =
      group.items.some(
        (item) =>
          item.kind === "live",
      );

    const icon =
      leaflet.divIcon({
        className:
          "allive-map-content-icon",
        html:
          `<div class="allive-map-content-marker ${
            hasLive
              ? "is-live"
              : "is-replay"
          }">${group.items.length}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

    const marker =
      leaflet
        .marker(
          [
            group.latitude,
            group.longitude,
          ],
          {
            icon,
          },
        )
        .addTo(map)
        .on("click", () =>
          onPress(group),
        );

    markerRef.current =
      marker;

    return () => {
      marker.remove();
      markerRef.current =
        null;
    };
  }, [
    leaflet,
    map,
    group,
    onPress,
  ]);

  return null;
}
