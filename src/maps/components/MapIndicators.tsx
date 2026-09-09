// src/maps/components/MapIndicators.tsx

import { Text, View } from "react-native";

import { mapStyles } from "../styles/mapStyles";

type MapIndicatorsProps = {
  activeCount: number;
  mappedCount: number;
};

export function MapIndicators({
  activeCount,
  mappedCount,
}: MapIndicatorsProps) {
  return (
    <View style={mapStyles.indicators}>
      <Text style={mapStyles.indicatorTitle}>Mapa</Text>

      <View style={mapStyles.indicatorRow}>
        <View style={mapStyles.liveDot} />

        <Text style={mapStyles.indicatorText}>
          {activeCount.toLocaleString("es-ES")} LIVE
          {mappedCount !== activeCount
            ? ` · ${mappedCount.toLocaleString("es-ES")} ubicados`
            : ""}
        </Text>
      </View>
    </View>
  );
}
