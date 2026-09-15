// src/components/live/broadcast/location/LiveLocationResult.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  LocationPlace,
} from "../../../../api/locationApi";

type Props = {
  place: LocationPlace;
  selected: boolean;
  onPress: (
    place: LocationPlace,
  ) => void;
};

export function LiveLocationResult({
  place,
  selected,
  onPress,
}: Props) {
  let iconName:
    | "location-outline"
    | "checkmark-circle" =
    "location-outline";

  let iconColor =
    "rgba(255,255,255,0.60)";

  if (selected) {
    iconName = "checkmark-circle";
    iconColor = "#FFFFFF";
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        onPress(place);
      }}
      style={({ pressed }) => [
        styles.container,
        selected &&
          styles.containerSelected,
        pressed &&
          styles.containerPressed,
      ]}
    >
      <View
        style={styles.iconContainer}
      >
        <Ionicons
          name={iconName}
          size={18}
          color={iconColor}
        />
      </View>

      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={styles.name}
        >
          {place.name}
        </Text>

        {place.address && (
          <Text
            numberOfLines={1}
            style={styles.address}
          >
            {place.address}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    container: {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 12,
      backgroundColor:
        "rgba(255,255,255,0.035)",
    },

    containerSelected: {
      backgroundColor:
        "rgba(255,255,255,0.11)",
    },

    containerPressed: {
      opacity: 0.72,
    },

    iconContainer: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      backgroundColor:
        "rgba(255,255,255,0.07)",
    },

    content: {
      flex: 1,
      minWidth: 0,
    },

    name: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "600",
    },

    address: {
      marginTop: 2,
      color:
        "rgba(255,255,255,0.43)",
      fontSize: 11,
      fontWeight: "400",
    },
  });