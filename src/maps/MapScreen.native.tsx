// src/maps/MapScreen.native.tsx

import { useCallback, useState } from "react";
import { View } from "react-native";

import { MapControls } from "./components/MapControls";
import { MapIndicators } from "./components/MapIndicators";
import { MapLivePreview } from "./components/MapLivePreview";
import { MapStatus } from "./components/MapStatus";
import { MapSurface } from "./components/MapSurface.native";
import { useMapLives } from "./hooks/useMapLives";
import { mapStyles } from "./styles/mapStyles";
import type { MappedLive } from "./types/mapTypes";

export function MapScreen() {
  const {
    lives,
    mappedLives,
    isLoading,
    error,
    refresh,
  } = useMapLives();

  const [selectedLive, setSelectedLive] =
    useState<MappedLive | null>(null);

  const handleLivePress = useCallback((live: MappedLive) => {
    setSelectedLive(live);
  }, []);

  return (
    <View style={mapStyles.screen}>
      <MapSurface
        lives={mappedLives}
        onLivePress={handleLivePress}
      />

      <View style={mapStyles.header}>
        <MapIndicators
          activeCount={lives.length}
          mappedCount={mappedLives.length}
        />

        <MapControls onRefresh={() => void refresh()} />
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
