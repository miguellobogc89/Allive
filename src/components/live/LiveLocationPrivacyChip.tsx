// src/components/live/LiveLocationPrivacyChip.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import type {
  BroadcastLocation,
  LocationStatus,
} from "./broadcastTypes";

type Props = {
  location: BroadcastLocation | null;
  locationStatus: LocationStatus;
  visible: boolean;
  onToggle: () => void;
};

export function LiveLocationPrivacyChip({
  location,
  locationStatus,
  visible,
  onToggle,
}: Props) {
  let locationText = "Sin ubicación";

  if (locationStatus === "loading") {
    locationText = "Localizando...";
  }

  if (
    locationStatus === "ready" &&
    location?.placeName
  ) {
    locationText = location.placeName;
  }

  return (
    <Pressable
      onPress={onToggle}
      style={styles.container}
    >
      <Ionicons
        name={
          visible
            ? "location"
            : "location-outline"
        }
        size={14}
        color="#FFFFFF"
      />

      <Text
        style={styles.text}
        numberOfLines={1}
      >
        {locationText}
      </Text>

      <Text style={styles.separator}>
        ·
      </Text>

      <Ionicons
        name={
          visible
            ? "eye-outline"
            : "eye-off-outline"
        }
        size={13}
        color="#D7D7D7"
      />

      <Text style={styles.visibility}>
        {visible ? "Visible" : "Oculta"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    height: 30,
    marginTop: 8,
    paddingHorizontal: 10,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.36)",
  },

  text: {
    maxWidth: 150,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  separator: {
    color: "#BDBDBD",
    fontSize: 12,
  },

  visibility: {
    color: "#D7D7D7",
    fontSize: 10,
    fontWeight: "600",
  },
});
