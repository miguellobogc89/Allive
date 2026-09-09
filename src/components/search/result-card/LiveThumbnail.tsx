// src/components/search/result-card/LiveThumbnail.tsx

import {
  Image,
  StyleSheet,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { styles } from "./searchResultCard.styles";

type Props = {
  thumbnailUrl: string | null;
};

export function LiveThumbnail({
  thumbnailUrl,
}: Props) {
  const hasThumbnail =
    typeof thumbnailUrl === "string" &&
    thumbnailUrl.length > 0;

  if (hasThumbnail) {
    return (
      <Image
        source={{
          uri: thumbnailUrl,
        }}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />
    );
  }

  return (
    <View style={styles.placeholder}>
      <LinearGradient
        colors={[
          "#34383B",
          "#24282B",
          "#181B1D",
        ]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}