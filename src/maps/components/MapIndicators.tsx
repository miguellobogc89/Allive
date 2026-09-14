// src/maps/components/MapIndicators.tsx

import {
  Text,
  View,
} from "react-native";

import {
  mapStyles,
} from "../styles/mapStyles";

type MapIndicatorsProps = {
  liveCount: number;
  replayCount: number;
  mappedCount: number;
};

export function MapIndicators({
  liveCount,
  replayCount,
  mappedCount,
}: MapIndicatorsProps) {
  return (
    <View style={mapStyles.indicators}>
      <Text style={mapStyles.indicatorTitle}>
        Mapa
      </Text>

      <View style={mapStyles.indicatorRow}>
        <View style={mapStyles.liveDot} />

        <Text style={mapStyles.indicatorText}>
          {liveCount.toLocaleString("es-ES")} LIVE
          {" · "}
          {replayCount.toLocaleString("es-ES")} REPLAY
          {" · "}
          {mappedCount.toLocaleString("es-ES")} ubicados
        </Text>
      </View>
    </View>
  );
}
