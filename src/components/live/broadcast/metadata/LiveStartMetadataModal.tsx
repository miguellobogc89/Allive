// src/components/live/broadcast/metadata/LiveStartMetadataModal.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type {
  LocationPlace,
} from "../../../../api/locationApi";

import {
  LiveLocationPicker,
} from "../location/LiveLocationPicker";

type LiveCoordinates = {
  latitude: number;
  longitude: number;
};

type LiveStartMetadataModalProps = {
  visible: boolean;

  title: string;
  eventName: string;

  locationName: string;

  locationCoordinates:
    | LiveCoordinates
    | null;

  selectedLocationPlace:
    | LocationPlace
    | null;

  locationVisible: boolean;

  onChangeTitle: (
    value: string,
  ) => void;

  onChangeEventName: (
    value: string,
  ) => void;

  onChangeLocationPlace: (
    place: LocationPlace | null,
  ) => void;

  onChangeLocationVisible: (
    visible: boolean,
  ) => void;

  onAccept: () => void;
  onClose: () => void;
};

export function LiveStartMetadataModal({
  visible,
  title,
  eventName,
  locationName,
  locationCoordinates,
  selectedLocationPlace,
  onChangeTitle,
  onChangeEventName,
  onChangeLocationPlace,
  onAccept,
  onClose,
}: LiveStartMetadataModalProps) {
  const backgroundOpacity =
    useRef(
      new Animated.Value(0),
    ).current;

  const [
    mounted,
    setMounted,
  ] = useState(visible);

  const [
    locationPickerVisible,
    setLocationPickerVisible,
  ] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);

      backgroundOpacity.stopAnimation();

      requestAnimationFrame(
        () => {
          Animated.timing(
            backgroundOpacity,
            {
              toValue: 1,
              duration: 180,
              useNativeDriver:
                true,
            },
          ).start();
        },
      );

      return;
    }

    setLocationPickerVisible(
      false,
    );

    if (!mounted) {
      return;
    }

    backgroundOpacity.stopAnimation();

    Animated.timing(
      backgroundOpacity,
      {
        toValue: 0,
        duration: 180,
        useNativeDriver:
          true,
      },
    ).start(
      ({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      },
    );
  }, [
    visible,
    mounted,
    backgroundOpacity,
  ]);

  if (!mounted) {
    return null;
  }

  function closeEditor() {
    onAccept();
    onClose();
  }

  let displayedLocationName =
    locationName;

  if (selectedLocationPlace) {
    displayedLocationName =
      selectedLocationPlace.name;
  }

  if (!displayedLocationName) {
    displayedLocationName =
      "Ubicación actual";
  }

  let locationChevron:
    | "chevron-down"
    | "chevron-up" =
    "chevron-down";

  if (locationPickerVisible) {
    locationChevron =
      "chevron-up";
  }

  let layerPointerEvents:
    | "auto"
    | "none" =
    "none";

  if (visible) {
    layerPointerEvents =
      "auto";
  }

  return (
    <View
      pointerEvents={
        layerPointerEvents
      }
      style={styles.layer}
    >
      {/*
       * Toda la pantalla fuera del
       * bloque cierra la edición.
       */}
      <Pressable
        style={
          StyleSheet.absoluteFill
        }
        onPress={
          closeEditor
        }
      />

      <View
        pointerEvents="box-none"
        style={
          styles.metadataPosition
        }
      >
        <Animated.View
          style={[
            styles.metadataBlock,

            {
              backgroundColor:
                backgroundOpacity.interpolate(
                  {
                    inputRange: [
                      0,
                      1,
                    ],

                    outputRange: [
                      "rgba(16,18,22,0)",
                      "rgba(16,18,22,0.76)",
                    ],
                  },
                ),
            },
          ]}
        >
          {/*
           * EVENTO
           *
           * Mismo tamaño que
           * LiveBroadcastMetadata.
           */}
          <TextInput
            value={eventName}
            onChangeText={
              onChangeEventName
            }
            placeholder="Nombre del evento"
            placeholderTextColor="rgba(255,255,255,0.58)"
            maxLength={100}
            multiline
            blurOnSubmit
            style={[
              styles.input,
              styles.eventInput,
            ]}
          />

          {/*
           * UBICACIÓN
           */}
          <View
            style={
              styles.locationArea
            }
          >
            {locationPickerVisible && (
              <View
                style={
                  styles.locationPickerAbove
                }
              >
                <LiveLocationPicker
                  visible
                  automaticLocationName={
                    locationName ||
                    "Ubicación actual"
                  }
                  coordinates={
                    locationCoordinates
                  }
                  selectedPlace={
                    selectedLocationPlace
                  }
                  onSelectPlace={(
                    place,
                  ) => {
                    onChangeLocationPlace(
                      place,
                    );

                    setLocationPickerVisible(
                      false,
                    );
                  }}
                  onClose={() => {
                    setLocationPickerVisible(
                      false,
                    );
                  }}
                />
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Editar ubicación"
              onPress={() => {
                setLocationPickerVisible(
                  (current) =>
                    !current,
                );
              }}
              style={({
                pressed,
              }) => [
                styles.locationRow,

                pressed &&
                  styles.pressed,
              ]}
            >
              <Ionicons
                name="location-outline"
                size={13}
                color="rgba(255,255,255,0.78)"
              />

              <Text
                numberOfLines={1}
                style={
                  styles.locationText
                }
              >
                {
                  displayedLocationName
                }
              </Text>

              <Ionicons
                name={
                  locationChevron
                }
                size={13}
                color="rgba(255,255,255,0.58)"
              />
            </Pressable>
          </View>

          {/*
           * TÍTULO / DESCRIPCIÓN
           *
           * Mismo tamaño que
           * LiveBroadcastTitle.
           */}
          <TextInput
            value={title}
            onChangeText={
              onChangeTitle
            }
            placeholder="¿Qué está pasando?"
            placeholderTextColor="rgba(255,255,255,0.52)"
            maxLength={120}
            multiline
            blurOnSubmit
            style={[
              styles.input,
              styles.titleInput,
            ]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    layer: {
      ...StyleSheet.absoluteFill,

      zIndex: 50,
    },

    /*
     * MISMA zona en la que
     * quedará el metadata cuando
     * desaparezca el editor.
     */
    metadataPosition: {
      position: "absolute",

      left: 18,
      right: 96,

      bottom: 92,

      zIndex: 60,
    },

    metadataBlock: {
      position: "relative",

      width: "100%",

      paddingHorizontal: 12,
      paddingVertical: 11,

      borderRadius: 14,

      gap: 5,

      overflow: "visible",
    },

    input: {
      width: "100%",

      padding: 0,
      margin: 0,

      borderWidth: 0,

      color: "#FFFFFF",

      backgroundColor:
        "transparent",

      outlineWidth: 0,

      textShadowColor:
        "rgba(0,0,0,0.9)",

      textShadowOffset: {
        width: 0,
        height: 2,
      },

      textShadowRadius: 4,
    },

    eventInput: {
      minHeight: 34,

      fontSize: 30,
      lineHeight: 34,

      fontWeight: "900",

      letterSpacing: -0.5,

      textShadowRadius: 5,
    },

    locationArea: {
      position: "relative",

      zIndex: 100,

      overflow: "visible",
    },

    locationRow: {
      minHeight: 18,

      flexDirection: "row",

      alignItems: "center",

      gap: 4,
    },

    locationText: {
      flex: 1,

      color:
        "rgba(255,255,255,0.78)",

      fontSize: 12,

      fontWeight: "500",
    },

    /*
     * IMPORTANTE:
     * el selector nace justo encima
     * de la línea de ubicación.
     */
    locationPickerAbove: {
      position: "absolute",

      left: -8,
      right: -8,

      bottom: 24,

      zIndex: 200,

      overflow: "visible",
    },

    titleInput: {
      minHeight: 20,

      fontSize: 15,
      lineHeight: 20,

      fontWeight: "600",
    },

    pressed: {
      opacity: 0.72,
    },
  });