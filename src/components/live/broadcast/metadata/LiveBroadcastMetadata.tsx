// src/components/live/broadcast/metadata/LiveBroadcastMetadata.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  LiveBroadcastLocation,
} from "./LiveBroadcastLocation";

import {
  LiveBroadcastTitle,
} from "./LiveBroadcastTitle";

type LiveBroadcastMetadataProps = {
  eventName: string;
  title: string;
  location: string | null;
};

export function LiveBroadcastMetadata({
  eventName,
  title,
  location,
}: LiveBroadcastMetadataProps) {
  const cleanEventName =
    eventName.trim();

  return (
    <View style={styles.container}>
      {cleanEventName ? (
        <Text
          style={styles.event}
          numberOfLines={2}
        >
          {cleanEventName}
        </Text>
      ) : null}

      <LiveBroadcastLocation
        location={location}
      />

      <LiveBroadcastTitle
        title={title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },

// src/components/live/broadcast/metadata/LiveBroadcastMetadata.tsx

event: {
  color: "#FFFFFF",

  fontSize: 30,
  lineHeight: 34,

  fontWeight: "900",

  letterSpacing: -0.5,

  textShadowColor: "rgba(0,0,0,0.9)",
  textShadowOffset: {
    width: 0,
    height: 2,
  },
  textShadowRadius: 5,
},
});