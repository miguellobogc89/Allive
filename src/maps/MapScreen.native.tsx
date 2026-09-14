// src/maps/MapScreen.native.tsx

import {
  useCallback,
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
} from "./components/MapSurface.native";

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

  return (
    <View style={mapStyles.screen}>
      <MapSurface
        groups={groups}
        onGroupPress={
          handleGroupPress
        }
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
