// src/maps/MapScreen.web.tsx

import { useCallback, useRef, useState } from "react";
import { View } from "react-native";

import { MapControls } from "./components/MapControls";
import { MapIndicators } from "./components/MapIndicators";
import { MapLivePreview } from "./components/MapLivePreview";
import { MapStatus } from "./components/MapStatus";
import { MapSurface } from "./components/MapSurface.web";
import { useMapLives } from "./hooks/useMapLives";
import { mapStyles } from "./styles/mapStyles";
import type { MappedLive } from "./types/mapTypes";
import type {
  LeafletGlobal,
  LeafletMap,
} from "./web/leafletTypes";

export function MapScreen() {
  const {
    lives,
    mappedLives,
    isLoading,
    error,
    refresh,
  } = useMapLives();

  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletGlobal | null>(null);

  const [selectedLive, setSelectedLive] =
    useState<MappedLive | null>(null);

  const handleLivePress = useCallback((live: MappedLive) => {
    setSelectedLive(live);
  }, []);

  const handleMapReady = useCallback(
    (map: LeafletMap, leaflet: LeafletGlobal) => {
      mapRef.current = map;
      leafletRef.current = leaflet;
    },
    [],
  );

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation || !mapRef.current) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        mapRef.current?.setView(
          [
            position.coords.latitude,
            position.coords.longitude,
          ],
          13,
        );
      },
      (locationError) => {
        console.warn(
          "No se pudo obtener la ubicación:",
          locationError,
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      },
    );
  }, []);

  return (
    <View style={mapStyles.screen}>
      <MapSurface
        lives={mappedLives}
        onLivePress={handleLivePress}
        onReady={handleMapReady}
      />

      <View style={mapStyles.header}>
        <MapIndicators
          activeCount={lives.length}
          mappedCount={mappedLives.length}
        />

        <MapControls
          onLocate={handleLocate}
          onRefresh={() => void refresh()}
        />
      </View>

      <MapStatus
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && mappedLives.length === 0}
      />

      {selectedLive ? (
        <View style={mapStyles.statusContainer}>
          <MapLivePreview
            live={selectedLive}
            onClose={() => setSelectedLive(null)}
          />
        </View>
      ) : null}
    </View>
  );
}
