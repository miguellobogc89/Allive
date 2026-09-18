// src/components/live/broadcast/metadata/LiveBroadcastMetadata.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type LiveBroadcastMetadataProps = {
  eventName?: string;
  title?: string;
  location?: string | null;
};

export function LiveBroadcastMetadata({
  eventName = "",
  title = "",
  location = null,
}: LiveBroadcastMetadataProps) {
  const cleanEventName =
    eventName.trim();

  const cleanTitle =
    title.trim();

  const cleanLocation =
    location?.trim() ?? "";

  return (
    <View
      style={
        styles.container
      }
    >
      {cleanEventName ? (
        <Text
          numberOfLines={1}
          style={
            styles.eventName
          }
        >
          {cleanEventName}
        </Text>
      ) : null}

      {cleanTitle ? (
        <Text
          numberOfLines={2}
          style={
            styles.title
          }
        >
          {cleanTitle}
        </Text>
      ) : null}

      {cleanLocation ? (
        <View
          style={
            styles.locationRow
          }
        >
          <Ionicons
            name="location-outline"
            size={15}
            color="rgba(255,255,255,0.82)"
          />

          <Text
            numberOfLines={1}
            style={
              styles.location
            }
          >
            {cleanLocation}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
      maxHeight: "100%",

      justifyContent:
        "flex-end",

      paddingVertical: 4,
    },

    eventName: {
      color:
        "rgba(255,255,255,0.72)",

      fontSize: 12,
      fontWeight: "600",

      marginBottom: 3,
    },

    title: {
      color: "#FFFFFF",

      fontSize: 18,
      lineHeight: 22,

      fontWeight: "700",
    },

    locationRow: {
      flexDirection: "row",
      alignItems: "center",

      marginTop: 5,

      minWidth: 0,
    },

    location: {
      flexShrink: 1,

      marginLeft: 4,

      color:
        "rgba(255,255,255,0.82)",

      fontSize: 12,
      lineHeight: 16,
    },
  });