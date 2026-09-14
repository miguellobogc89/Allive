// src/maps/components/MapSurface.native.tsx

import MapView from "react-native-maps";

import { mapStyles } from "../styles/mapStyles";
import type {
  MapContentGroup,
} from "../types/mapTypes";
import { MapActivityPulse } from "./MapActivityPulse.native";

type MapSurfaceProps = {
  groups: MapContentGroup[];
  onGroupPress: (
    group: MapContentGroup,
  ) => void;
};

function getMarkerRenderKey(
  group: MapContentGroup,
) {
  const hasLive =
    group.items.some(
      (item) =>
        item.kind === "live",
    );

  const itemSignature =
    group.items
      .map(
        (item) =>
          `${item.kind}:${item.id}:${item.thumbnailUrl ?? ""}:${item.title ?? ""}:${item.viewerCount ?? ""}`,
      )
      .join("|");

  return `${group.id}:${hasLive ? "live" : "replay"}:${group.items.length}:${itemSignature}`;
}

export function MapSurface({
  groups,
  onGroupPress,
}: MapSurfaceProps) {
  return (
    <MapView
      style={mapStyles.map}
      initialRegion={{
        latitude: 39.6,
        longitude: -3.7,
        latitudeDelta: 9,
        longitudeDelta: 9,
      }}
    >
      {groups.map((group) => (
        <MapActivityPulse
          key={
            getMarkerRenderKey(
              group,
            )
          }
          group={group}
          onPress={onGroupPress}
        />
      ))}
    </MapView>
  );
}
