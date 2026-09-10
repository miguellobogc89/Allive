// src/components/live/broadcast/metadata/LiveBroadcastMetadata.tsx

import { StyleSheet, View } from "react-native";

import { LiveBroadcastTitle } from "./LiveBroadcastTitle";
import { LiveBroadcastLocation } from "./LiveBroadcastLocation";

type LiveBroadcastMetadataProps = {
  title: string;
  location: string | null;
};

export function LiveBroadcastMetadata({
  title,
  location,
}: LiveBroadcastMetadataProps) {
  return (
    <View style={styles.container}>
      <LiveBroadcastTitle title={title} />
      <LiveBroadcastLocation location={location} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
});
