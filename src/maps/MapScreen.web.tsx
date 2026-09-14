// src/maps/MapScreen.web.tsx

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  View,
} from "react-native";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  MapContentCarousel,
} from "./components/MapContentCarousel";

import {
  MapControls,
} from "./components/MapControls";

import {
  MapIndicators,
} from "./components/MapIndicators";

import {
  MapStatus,
} from "./components/MapStatus";

import {
  MapSurface,
} from "./components/MapSurface.web";

import {
  useMapContent,
} from "./hooks/useMapContent";

import {
  mapStyles,
} from "./styles/mapStyles";

import type {
  MapContentGroup,
  MapContentItem,
} from "./types/mapTypes";

import type {
  LeafletGlobal,
  LeafletMap,
} from "./web/leafletTypes";

type MapScreenProps = {
  onOpenLive?: (
    liveId: string,
  ) => void;
  onOpenReplay?: (
    replayId: string,
  ) => void;
};

export function MapScreen({
  onOpenLive,
  onOpenReplay,
}: MapScreenProps) {
  const insets =
    useSafeAreaInsets();

  const {
    liveCount,
    replayCount,
    itemCount,
    groups,
    isLoading,
    error,
    refresh,
  } = useMapContent();

  const mapRef =
    useRef<LeafletMap | null>(
      null,
    );

  const leafletRef =
    useRef<LeafletGlobal | null>(
      null,
    );

  const [
    selectedGroupId,
    setSelectedGroupId,
  ] =
    useState<string | null>(
      null,
    );

  const selectedGroup =
    groups.find(
      (group) =>
        group.id ===
        selectedGroupId,
    ) ?? null;

  const handleGroupPress =
    useCallback(
      (
        group: MapContentGroup,
      ) => {
        setSelectedGroupId(
          group.id,
        );
      },
      [],
    );

  const handleOpenItem =
    useCallback(
      (
        item: MapContentItem,
      ) => {
        if (item.kind === "live") {
          onOpenLive?.(item.id);
          return;
        }

        onOpenReplay?.(item.id);
      },
      [
        onOpenLive,
        onOpenReplay,
      ],
    );

  const handleMapReady =
    useCallback(
      (
        map: LeafletMap,
        leaflet: LeafletGlobal,
      ) => {
        mapRef.current = map;
        leafletRef.current =
          leaflet;
      },
      [],
    );

  const handleLocate =
    useCallback(() => {
      if (
        !navigator.geolocation ||
        !mapRef.current
      ) {
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapRef.current?.setView(
            [
              position.coords
                .latitude,
              position.coords
                .longitude,
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
        groups={groups}
        onGroupPress={
          handleGroupPress
        }
        onReady={handleMapReady}
      />

      <View style={mapStyles.header}>
        <MapIndicators
          liveCount={liveCount}
          replayCount={
            replayCount
          }
          mappedCount={
            itemCount
          }
        />

        <MapControls
          onLocate={handleLocate}
          onRefresh={() =>
            void refresh()
          }
        />
      </View>

      <MapStatus
        isLoading={isLoading}
        error={error}
        isEmpty={
          !isLoading &&
          itemCount === 0
        }
      />

      {selectedGroup ? (
        <View
          style={[
            mapStyles.statusContainer,
            {
              bottom:
                mapStyles.statusContainer
                  .bottom +
                insets.bottom,
            },
          ]}
        >
          <MapContentCarousel
            group={selectedGroup}
            onClose={() =>
              setSelectedGroupId(null)
            }
            onOpenItem={
              handleOpenItem
            }
          />
        </View>
      ) : null}
    </View>
  );
}
