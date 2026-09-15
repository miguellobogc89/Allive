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
  colors,
  radius,
  spacing,
} from "../../../../styles";

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
  locationVisible,
  onChangeTitle,
  onChangeEventName,
  onChangeLocationPlace,
  onChangeLocationVisible,
  onAccept,
  onClose,
}: LiveStartMetadataModalProps) {
  const opacity =
    useRef(
      new Animated.Value(0),
    ).current;

  const translateY =
    useRef(
      new Animated.Value(14),
    ).current;

  const [
    mounted,
    setMounted,
  ] = useState(
    visible,
  );

  const [
    locationPickerVisible,
    setLocationPickerVisible,
  ] = useState(
    false,
  );

  useEffect(
    () => {
      if (visible) {
        setMounted(
          true,
        );

        opacity.stopAnimation();
        translateY.stopAnimation();

        opacity.setValue(
          0,
        );

        translateY.setValue(
          14,
        );

        requestAnimationFrame(
          () => {
            Animated.parallel([
              Animated.timing(
                opacity,
                {
                  toValue: 1,
                  duration: 220,
                  useNativeDriver:
                    true,
                },
              ),

              Animated.timing(
                translateY,
                {
                  toValue: 0,
                  duration: 240,
                  useNativeDriver:
                    true,
                },
              ),
            ]).start();
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

      opacity.stopAnimation();
      translateY.stopAnimation();

      Animated.parallel([
        Animated.timing(
          opacity,
          {
            toValue: 0,
            duration: 160,
            useNativeDriver:
              true,
          },
        ),

        Animated.timing(
          translateY,
          {
            toValue: -10,
            duration: 180,
            useNativeDriver:
              true,
          },
        ),
      ]).start(
        ({
          finished,
        }) => {
          if (
            finished
          ) {
            setMounted(
              false,
            );
          }
        },
      );
    },
    [
      visible,
      opacity,
      translateY,
      mounted,
    ],
  );

  if (!mounted) {
    return null;
  }

  let displayedLocationName =
    locationName;

  if (
    selectedLocationPlace
  ) {
    displayedLocationName =
      selectedLocationPlace.name;
  }

  if (
    !displayedLocationName
  ) {
    displayedLocationName =
      "Detectando ubicación…";
  }

  let pickerIcon:
    | "chevron-down"
    | "chevron-up" =
    "chevron-down";

  if (
    locationPickerVisible
  ) {
    pickerIcon =
      "chevron-up";
  }

  let visibleIconColor =
    "rgba(255,255,255,0.48)";

  if (
    locationVisible
  ) {
    visibleIconColor =
      "#FFFFFF";
  }

  let hiddenIconColor =
    "rgba(255,255,255,0.48)";

  if (
    !locationVisible
  ) {
    hiddenIconColor =
      "#FFFFFF";
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
      style={
        styles.layer
      }
    >
      <Pressable
        style={
          StyleSheet.absoluteFill
        }
        onPress={
          onClose
        }
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.backdrop,
            {
              opacity,
            },
          ]}
        />
      </Pressable>

      <View
        pointerEvents="box-none"
        style={
          styles.centerStage
        }
      >
        <Animated.View
          style={[
            styles.card,
            {
              opacity,

              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar"
            hitSlop={10}
            onPress={
              onClose
            }
            style={({
              pressed,
            }) => [
              styles.closeButton,

              pressed &&
                styles.closeButtonPressed,
            ]}
          >
            <Ionicons
              name="close"
              size={22}
              color="rgba(255,255,255,0.78)"
            />
          </Pressable>

          <View
            style={
              styles.content
            }
          >
            <TextInput
              value={
                title
              }
              onChangeText={
                onChangeTitle
              }
              placeholder="¿Qué está pasando?"
              placeholderTextColor="rgba(255,255,255,0.55)"
              maxLength={120}
              style={[
                styles.input,
                styles.titleInput,
              ]}
            />

            <TextInput
              value={
                eventName
              }
              onChangeText={
                onChangeEventName
              }
              placeholder="¿Cómo se llama el evento?"
              placeholderTextColor="rgba(255,255,255,0.55)"
              maxLength={100}
              style={
                styles.input
              }
            />

            <View
              style={
                styles.locationBlock
              }
            >
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setLocationPickerVisible(
                    (
                      current,
                    ) =>
                      !current,
                  );
                }}
                style={({
                  pressed,
                }) => [
                  styles.locationIdentity,

                  pressed &&
                    styles.locationIdentityPressed,
                ]}
              >
                <View
                  style={
                    styles.locationIcon
                  }
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color="rgba(255,255,255,0.75)"
                  />
                </View>

                <View
                  style={
                    styles.locationContent
                  }
                >
                  <Text
                    style={
                      styles.locationLabel
                    }
                  >
                    Ubicación
                  </Text>

                  <Text
                    numberOfLines={
                      1
                    }
                    style={
                      styles.locationText
                    }
                  >
                    {
                      displayedLocationName
                    }
                  </Text>
                </View>

                <Ionicons
                  name={
                    pickerIcon
                  }
                  size={17}
                  color="rgba(255,255,255,0.45)"
                />
              </Pressable>

              {locationPickerVisible && (
                <LiveLocationPicker
                  visible
                  automaticLocationName={
                    locationName ||
                    "Detectando ubicación…"
                  }
                  coordinates={
                    locationCoordinates
                  }
                  selectedPlace={
                    selectedLocationPlace
                  }
                  onSelectPlace={
                    onChangeLocationPlace
                  }
                  onClose={() => {
                    setLocationPickerVisible(
                      false,
                    );
                  }}
                />
              )}

              <View
                style={
                  styles.visibilityRow
                }
              >
                <Text
                  style={
                    styles.visibilityLabel
                  }
                >
                  Mostrar ubicación
                </Text>

                <View
                  style={
                    styles.visibilitySelector
                  }
                >
                  <Pressable
                    onPress={() => {
                      onChangeLocationVisible(
                        true,
                      );
                    }}
                    style={({
                      pressed,
                    }) => [
                      styles.visibilityOption,

                      locationVisible &&
                        styles.visibilityOptionActive,

                      pressed &&
                        styles.visibilityOptionPressed,
                    ]}
                  >
                    <Ionicons
                      name="eye-outline"
                      size={15}
                      color={
                        visibleIconColor
                      }
                    />

                    <Text
                      style={[
                        styles.visibilityText,

                        locationVisible &&
                          styles.visibilityTextActive,
                      ]}
                    >
                      Visible
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      onChangeLocationVisible(
                        false,
                      );
                    }}
                    style={({
                      pressed,
                    }) => [
                      styles.visibilityOption,

                      !locationVisible &&
                        styles.visibilityOptionActive,

                      pressed &&
                        styles.visibilityOptionPressed,
                    ]}
                  >
                    <Ionicons
                      name="eye-off-outline"
                      size={15}
                      color={
                        hiddenIconColor
                      }
                    />

                    <Text
                      style={[
                        styles.visibilityText,

                        !locationVisible &&
                          styles.visibilityTextActive,
                      ]}
                    >
                      Oculta
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={
                onAccept
              }
              style={({
                pressed,
              }) => [
                styles.acceptButton,

                pressed &&
                  styles.acceptButtonPressed,
              ]}
            >
              <Text
                style={
                  styles.acceptButtonText
                }
              >
                Aceptar
              </Text>
            </Pressable>
          </View>
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

    backdrop: {
      ...StyleSheet.absoluteFill,

      backgroundColor:
        "rgba(0,0,0,0.18)",
    },

    centerStage: {
      ...StyleSheet.absoluteFill,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        24,
    },

    card: {
      position:
        "relative",

      width:
        "100%",

      maxWidth:
        420,

      padding:
        spacing.lg,

      borderRadius:
        20,

      backgroundColor:
        "rgba(12,14,17,0.86)",

      overflow:
        "visible",
    },

    closeButton: {
      position:
        "absolute",

      top: 10,
      right: 10,

      width: 34,
      height: 34,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius:
        17,

      zIndex: 2,
    },

    closeButtonPressed: {
      backgroundColor:
        "rgba(255,255,255,0.08)",
    },

    content: {
      gap:
        spacing.md,

      paddingTop:
        24,

      overflow:
        "visible",
    },

    input: {
      minHeight:
        48,

      paddingHorizontal:
        14,

      color:
        "#FFFFFF",

      fontSize:
        14,

      fontWeight:
        "500",

      borderWidth:
        1,

      borderColor:
        "rgba(255,255,255,0.24)",

      borderRadius:
        radius.md,

      backgroundColor:
        "rgba(255,255,255,0.06)",

      outlineWidth:
        0,
    },

    titleInput: {
      borderColor:
        "rgba(255,255,255,0.46)",

      fontSize:
        15,

      fontWeight:
        "600",
    },

    locationBlock: {
      position:
        "relative",

      zIndex:
        20,

      gap:
        10,

      paddingHorizontal:
        2,

      paddingVertical:
        4,

      overflow:
        "visible",
    },

    locationIdentity: {
      minHeight:
        42,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        10,

      paddingVertical:
        3,

      borderRadius:
        10,

      zIndex:
        22,
    },

    locationIdentityPressed: {
      opacity:
        0.72,
    },

    locationIcon: {
      width: 30,
      height: 30,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius:
        15,

      backgroundColor:
        "rgba(255,255,255,0.07)",
    },

    locationContent: {
      flex: 1,

      minWidth:
        0,
    },

    locationLabel: {
      marginBottom:
        2,

      color:
        "rgba(255,255,255,0.46)",

      fontSize:
        11,

      fontWeight:
        "500",
    },

    locationText: {
      color:
        "#FFFFFF",

      fontSize:
        14,

      fontWeight:
        "600",
    },

    visibilityRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      gap:
        spacing.sm,
    },

    visibilityLabel: {
      color:
        "rgba(255,255,255,0.58)",

      fontSize:
        12,

      fontWeight:
        "500",
    },

    visibilitySelector: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 4,

      padding: 3,

      borderRadius:
        10,

      backgroundColor:
        "rgba(255,255,255,0.07)",
    },

    visibilityOption: {
      height: 30,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 5,

      paddingHorizontal:
        9,

      borderRadius:
        8,
    },

    visibilityOptionActive: {
      backgroundColor:
        "rgba(255,255,255,0.14)",
    },

    visibilityOptionPressed: {
      opacity:
        0.72,
    },

    visibilityText: {
      color:
        "rgba(255,255,255,0.48)",

      fontSize:
        11,

      fontWeight:
        "600",
    },

    visibilityTextActive: {
      color:
        "#FFFFFF",
    },

    acceptButton: {
      height:
        46,

      marginTop:
        4,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius:
        radius.md,

      backgroundColor:
        colors.accent,
    },

    acceptButtonPressed: {
      opacity:
        0.82,

      transform: [
        {
          scale:
            0.99,
        },
      ],
    },

    acceptButtonText: {
      color:
        "#FFFFFF",

      fontSize:
        14,

      fontWeight:
        "700",
    },
  });