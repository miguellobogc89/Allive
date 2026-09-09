// src/maps/components/MapControls.tsx

import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { colors } from "../../styles";
import { mapStyles } from "../styles/mapStyles";

type MapControlsProps = {
  onLocate?: () => void;
  onRefresh: () => void;
};

export function MapControls({
  onLocate,
  onRefresh,
}: MapControlsProps) {
  return (
    <View style={mapStyles.controls}>
      {onLocate ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ir a mi ubicación"
          onPress={onLocate}
          style={mapStyles.circleButton}
        >
          <Ionicons
            name="locate"
            size={21}
            color={colors.text}
          />
        </Pressable>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Actualizar mapa"
        onPress={onRefresh}
        style={mapStyles.circleButton}
      >
        <Ionicons
          name="refresh"
          size={20}
          color={colors.text}
        />
      </Pressable>
    </View>
  );
}
