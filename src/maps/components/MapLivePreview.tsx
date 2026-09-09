// src/maps/components/MapLivePreview.tsx

import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { colors } from "../../styles";
import { mapStyles } from "../styles/mapStyles";
import type { MappedLive } from "../types/mapTypes";

type MapLivePreviewProps = {
  live: MappedLive;
  onClose: () => void;
};

export function MapLivePreview({
  live,
  onClose,
}: MapLivePreviewProps) {
  const username =
    live.creator.displayName || `@${live.creator.username}`;

  return (
    <View style={mapStyles.preview}>
      <View style={mapStyles.previewTopRow}>
        <View style={mapStyles.previewIdentity}>
          <Text
            numberOfLines={1}
            style={mapStyles.previewUsername}
          >
            {username}
          </Text>

          {live.placeName ? (
            <Text
              numberOfLines={1}
              style={mapStyles.previewPlace}
            >
              {live.placeName}
            </Text>
          ) : null}
        </View>

        <View style={mapStyles.liveBadge}>
          <View style={mapStyles.liveDot} />
          <Text style={mapStyles.liveBadgeText}>LIVE</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar detalle"
          onPress={onClose}
          style={mapStyles.closeButton}
        >
          <Ionicons
            name="close"
            size={20}
            color={colors.text}
          />
        </Pressable>
      </View>

      {live.title ? (
        <Text
          numberOfLines={2}
          style={mapStyles.previewTitle}
        >
          {live.title}
        </Text>
      ) : null}
    </View>
  );
}
