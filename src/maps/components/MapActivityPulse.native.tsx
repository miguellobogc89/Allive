// src/maps/components/MapActivityPulse.native.tsx

import {
  Text,
  View,
} from "react-native";

import {
  Marker,
} from "react-native-maps";

import {
  mapStyles,
} from "../styles/mapStyles";

import type {
  MapContentGroup,
} from "../types/mapTypes";

type MapActivityPulseProps = {
  group: MapContentGroup;
  onPress: (
    group: MapContentGroup,
  ) => void;
};

export function MapActivityPulse({
  group,
  onPress,
}: MapActivityPulseProps) {
  const hasLive =
    group.items.some(
      (item) =>
        item.kind === "live",
    );

  return (
    <Marker
      coordinate={{
        latitude:
          group.latitude,
        longitude:
          group.longitude,
      }}
      onPress={() =>
        onPress(group)
      }
      tracksViewChanges={false}
    >
      <View
        style={[
          mapStyles.contentMarker,
          hasLive
            ? mapStyles.contentMarkerLive
            : mapStyles.contentMarkerReplay,
        ]}
      >
        <Text
          style={
            mapStyles.contentMarkerText
          }
        >
          {group.items.length}
        </Text>
      </View>
    </Marker>
  );
}
