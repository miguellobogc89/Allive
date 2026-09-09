// src/maps/components/MapSurface.web.tsx

import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { mapStyles } from "../styles/mapStyles";
import type { MappedLive } from "../types/mapTypes";
import { loadLeaflet } from "../web/loadLeaflet";
import type {
  LeafletGlobal,
  LeafletMap,
} from "../web/leafletTypes";
import { MapActivityPulse } from "./MapActivityPulse.web";

type MapSurfaceProps = {
  lives: MappedLive[];
  onLivePress: (live: MappedLive) => void;
  onReady?: (
    map: LeafletMap,
    leaflet: LeafletGlobal,
  ) => void;
};

export function MapSurface({
  lives,
  onLivePress,
  onReady,
}: MapSurfaceProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  const [leaflet, setLeaflet] =
    useState<LeafletGlobal | null>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    let disposed = false;

    async function createMap() {
      const host = hostRef.current;

      if (!host || mapRef.current) {
        return;
      }

      const loadedLeaflet = await loadLeaflet();

      if (disposed) {
        return;
      }

      host.classList.add("allive-leaflet-map");

      const createdMap = loadedLeaflet.map(host, {
        zoomControl: true,
        attributionControl: true,
      });

      loadedLeaflet
        .tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          },
        )
        .addTo(createdMap);

      createdMap.setView([39.6, -3.7], 6);

      mapRef.current = createdMap;
      setLeaflet(loadedLeaflet);
      setMap(createdMap);
      onReady?.(createdMap, loadedLeaflet);

      window.setTimeout(() => {
        createdMap.invalidateSize();
      }, 0);
    }

    void createMap();

    return () => {
      disposed = true;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onReady]);

  return (
    <View
      ref={(node) => {
        hostRef.current = node as unknown as HTMLElement | null;
      }}
      style={mapStyles.map}
    >
      {lives.map((live) => (
        <MapActivityPulse
          key={live.id}
          leaflet={leaflet}
          map={map}
          live={live}
          onPress={onLivePress}
        />
      ))}
    </View>
  );
}
