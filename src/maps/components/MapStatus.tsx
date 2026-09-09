// src/maps/components/MapStatus.tsx

import { ActivityIndicator, Text, View } from "react-native";

import { colors } from "../../styles";
import { mapStyles } from "../styles/mapStyles";

type MapStatusProps = {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
};

export function MapStatus({
  isLoading,
  error,
  isEmpty,
}: MapStatusProps) {
  if (!isLoading && !error && !isEmpty) {
    return null;
  }

  let content = null;

  if (isLoading) {
    content = <ActivityIndicator color={colors.text} />;
  } else if (error) {
    content = <Text style={mapStyles.statusText}>{error}</Text>;
  } else {
    content = (
      <Text style={mapStyles.statusText}>
        No hay LIVE con ubicación ahora mismo
      </Text>
    );
  }

  return (
    <View style={mapStyles.statusContainer}>
      <View style={mapStyles.statusPill}>{content}</View>
    </View>
  );
}
