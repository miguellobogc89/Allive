// src/maps/components/MapSurface.native.tsx

import MapView from "react-native-maps";

import { mapStyles } from "../styles/mapStyles";
import type { MappedLive } from "../types/mapTypes";
import { MapActivityPulse } from "./MapActivityPulse.native";

type MapSurfaceProps = {
  lives: MappedLive[];
  onLivePress: (live: MappedLive) => void;
};

export function MapSurface({
  lives,
  onLivePress,
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
      {lives.map((live) => (
        <MapActivityPulse
          key={live.id}
          live={live}
          onPress={onLivePress}
        />
      ))}
    </MapView>
  );
}
