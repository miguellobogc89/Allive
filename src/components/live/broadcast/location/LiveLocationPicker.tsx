// src/components/live/broadcast/location/LiveLocationPicker.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  LocationPlace,
} from "../../../../api/locationApi";

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

const EXACT_LOCATION_ID =
  "__allive_exact_location__";

export function LiveLocationPicker({
  visible,
  automaticLocationName,
  coordinates,
  selectedPlace,
  onSelectPlace,
  onClose,
}: Props) {
  const {
    places,
    loading,
  } = useLiveLocationPicker({
    coordinates,
    enabled: visible,
  });

  if (!visible) {
    return null;
  }

  const approximateSelected =
    !selectedPlace;

  const exactSelected =
    selectedPlace?.id ===
    EXACT_LOCATION_ID;

  function selectExactLocation() {
    if (!coordinates) {
      return;
    }

    onSelectPlace({
      id:
        EXACT_LOCATION_ID,

      name:
        "Ubicación exacta",

      address:
        null,

      latitude:
        coordinates.latitude,

      longitude:
        coordinates.longitude,
    });

    onClose();
  }

  function selectApproximateLocation() {
    onSelectPlace(
      null,
    );

    onClose();
  }

  function selectPlace(
    place: LocationPlace,
  ) {
    onSelectPlace(
      place,
    );

    onClose();
  }

  return (
    <View
      style={
        styles.floatingContainer
      }
    >
      <View
        style={
          styles.header
        }
      >
        <Text
          style={
            styles.headerTitle
          }
        >
          Compartir ubicación
        </Text>

        {loading && (
          <ActivityIndicator
            size="small"
            color="rgba(255,255,255,0.55)"
          />
        )}
      </View>

      <ScrollView
        style={
          styles.scroll
        }
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
        nestedScrollEnabled
      >
        {coordinates && (
          <Pressable
            onPress={
              selectExactLocation
            }
            style={({
              pressed,
            }) => [
              styles.option,
              exactSelected &&
                styles.optionSelected,
              pressed &&
                styles.optionPressed,
            ]}
          >
            <View
              style={
                styles.icon
              }
            >
              <Ionicons
                name="navigate"
                size={18}
                color="#FFFFFF"
              />
            </View>

            <View
              style={
                styles.optionContent
              }
            >
              <Text
                style={
                  styles.optionTitle
                }
              >
                Ubicación exacta
              </Text>

              <Text
                style={
                  styles.optionSubtitle
                }
              >
                Comparte tu posición GPS
              </Text>
            </View>

            {exactSelected && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#FFFFFF"
              />
            )}
          </Pressable>
        )}

        {places.map(
          (
            place,
          ) => {
            const selected =
              selectedPlace?.id ===
              place.id;

            return (
              <Pressable
                key={
                  place.id
                }
                onPress={() => {
                  selectPlace(
                    place,
                  );
                }}
                style={({
                  pressed,
                }) => [
                  styles.option,
                  selected &&
                    styles.optionSelected,
                  pressed &&
                    styles.optionPressed,
                ]}
              >
                <View
                  style={
                    styles.icon
                  }
                >
                  <Ionicons
                    name="location"
                    size={18}
                    color="#FFFFFF"
                  />
                </View>

                <View
                  style={
                    styles.optionContent
                  }
                >
                  <Text
                    numberOfLines={
                      1
                    }
                    style={
                      styles.optionTitle
                    }
                  >
                    {
                      place.name
                    }
                  </Text>

                  <Text
                    numberOfLines={
                      1
                    }
                    style={
                      styles.optionSubtitle
                    }
                  >
                    Lugar cercano
                  </Text>
                </View>

                {selected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#FFFFFF"
                  />
                )}
              </Pressable>
            );
          },
        )}

        <Pressable
          onPress={
            selectApproximateLocation
          }
          style={({
            pressed,
          }) => [
            styles.option,
            approximateSelected &&
              styles.optionSelected,
            pressed &&
              styles.optionPressed,
          ]}
        >
          <View
            style={
              styles.icon
            }
          >
            <Ionicons
              name="map-outline"
              size={18}
              color="#FFFFFF"
            />
          </View>

          <View
            style={
              styles.optionContent
            }
          >
            <Text
              numberOfLines={1}
              style={
                styles.optionTitle
              }
            >
              {
                automaticLocationName
              }
            </Text>

            <Text
              style={
                styles.optionSubtitle
              }
            >
              Barrio o ciudad
            </Text>
          </View>

          {approximateSelected && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#FFFFFF"
            />
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    floatingContainer: {
      position:
        "absolute",

      top: 48,
      left: 0,
      right: 0,

      zIndex: 100,

      maxHeight: 260,

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.14)",

      borderRadius: 16,

      backgroundColor:
        "rgba(20,22,25,0.98)",

      shadowColor:
        "#000000",

      shadowOpacity:
        0.45,

      shadowRadius:
        20,

      shadowOffset: {
        width: 0,
        height: 8,
      },

      elevation: 18,

      overflow:
        "hidden",
    },

    header: {
      height: 38,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      paddingHorizontal:
        13,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      borderBottomColor:
        "rgba(255,255,255,0.10)",
    },

    headerTitle: {
      color:
        "rgba(255,255,255,0.55)",

      fontSize: 10,

      fontWeight:
        "600",

      textTransform:
        "uppercase",

      letterSpacing:
        0.6,
    },

    scroll: {
      maxHeight:
        220,
    },

    scrollContent: {
      padding:
        6,
    },

    option: {
      minHeight:
        54,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 10,

      paddingHorizontal:
        9,

      paddingVertical:
        7,

      borderRadius:
        11,
    },

    optionSelected: {
      backgroundColor:
        "rgba(255,255,255,0.10)",
    },

    optionPressed: {
      backgroundColor:
        "rgba(255,255,255,0.07)",
    },

    icon: {
      width: 34,
      height: 34,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius:
        17,

      backgroundColor:
        "rgba(255,255,255,0.08)",
    },

    optionContent: {
      flex: 1,
      minWidth: 0,
    },

    optionTitle: {
      color:
        "#FFFFFF",

      fontSize:
        13,

      fontWeight:
        "600",
    },

    optionSubtitle: {
      marginTop:
        2,

      color:
        "rgba(255,255,255,0.43)",

      fontSize:
        10,

      fontWeight:
        "400",
    },
  }); 