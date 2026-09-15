// src/components/live/broadcast/location/LiveLocationPicker.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  LocationPlace,
} from "../../../../api/locationApi";

import {
  LiveLocationResult,
} from "./LiveLocationResult";

import {
  LiveLocationSearchInput,
} from "./LiveLocationSearchInput";

import {
  useLiveLocationPicker,
} from "./useLiveLocationPicker";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Props = {
  visible: boolean;

  automaticLocationName: string;

  coordinates:
    | Coordinates
    | null;

  selectedPlace:
    | LocationPlace
    | null;

  onSelectPlace: (
    place: LocationPlace | null,
  ) => void;

  onClose: () => void;
};

export function LiveLocationPicker({
  visible,
  automaticLocationName,
  coordinates,
  selectedPlace,
  onSelectPlace,
  onClose,
}: Props) {
  const {
    query,
    setQuery,
    places,
    loading,
  } = useLiveLocationPicker({
    coordinates,
    enabled: visible,
  });

  if (!visible) {
    return null;
  }

  const automaticSelected =
    !selectedPlace;

  let resultsTitle =
    "Cerca de ti";

  if (
    query.trim().length >= 2
  ) {
    resultsTitle = "Resultados";
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Ubicación del LIVE
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar ubicaciones"
          hitSlop={8}
          onPress={onClose}
        >
          <Ionicons
            name="close"
            size={20}
            color="rgba(255,255,255,0.66)"
          />
        </Pressable>
      </View>

      <Pressable
        onPress={() => {
          onSelectPlace(null);
        }}
        style={({ pressed }) => [
          styles.automaticLocation,
          automaticSelected &&
            styles.automaticLocationSelected,
          pressed &&
            styles.pressed,
        ]}
      >
        <View style={styles.autoIcon}>
          <Ionicons
            name="navigate-outline"
            size={17}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.autoContent}>
          <Text style={styles.autoLabel}>
            Ubicación aproximada
          </Text>

          <Text
            numberOfLines={1}
            style={styles.autoName}
          >
            {automaticLocationName}
          </Text>
        </View>

        {automaticSelected && (
          <Ionicons
            name="checkmark-circle"
            size={19}
            color="#FFFFFF"
          />
        )}
      </Pressable>

      <LiveLocationSearchInput
        value={query}
        onChangeText={setQuery}
      />

      <View
        style={styles.resultsHeader}
      >
        <Text
          style={styles.resultsTitle}
        >
          {resultsTitle}
        </Text>

        {loading && (
          <ActivityIndicator
            size="small"
            color="rgba(255,255,255,0.52)"
          />
        )}
      </View>

      <View style={styles.results}>
        {places.map((place) => {
          const selected =
            selectedPlace?.id ===
            place.id;

          return (
            <LiveLocationResult
              key={place.id}
              place={place}
              selected={selected}
              onPress={
                onSelectPlace
              }
            />
          );
        })}

        {!loading &&
          places.length === 0 && (
            <View
              style={styles.empty}
            >
              <Text
                style={
                  styles.emptyText
                }
              >
                No se han encontrado
                lugares.
              </Text>
            </View>
          )}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      gap: 10,
      padding: 12,
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.11)",
      borderRadius: 14,
      backgroundColor:
        "rgba(0,0,0,0.18)",
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    title: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "600",
    },

    automaticLocation: {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 12,
      backgroundColor:
        "rgba(255,255,255,0.04)",
    },

    automaticLocationSelected: {
      backgroundColor:
        "rgba(255,255,255,0.11)",
    },

    pressed: {
      opacity: 0.72,
    },

    autoIcon: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      backgroundColor:
        "rgba(255,255,255,0.08)",
    },

    autoContent: {
      flex: 1,
      minWidth: 0,
    },

    autoLabel: {
      color:
        "rgba(255,255,255,0.43)",
      fontSize: 10,
      fontWeight: "400",
    },

    autoName: {
      marginTop: 1,
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "600",
    },

    resultsHeader: {
      minHeight: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      paddingHorizontal: 2,
    },

    resultsTitle: {
      color:
        "rgba(255,255,255,0.45)",
      fontSize: 10,
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },

    results: {
      gap: 5,
      maxHeight: 230,
      overflow: "hidden",
    },

    empty: {
      paddingVertical: 14,
      alignItems: "center",
    },

    emptyText: {
      color:
        "rgba(255,255,255,0.42)",
      fontSize: 12,
      fontWeight: "400",
    },
  });