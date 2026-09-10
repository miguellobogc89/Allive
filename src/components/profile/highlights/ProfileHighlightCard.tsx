// src/components/profile/highlights/ProfileHighlightCard.tsx

import { Ionicons } from "@expo/vector-icons";

import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ProfileVideoItem } from "../profileTypes";

type Props = {
  video: ProfileVideoItem;
};

function formatViewers(
  value?: number,
) {
  if (value === undefined) {
    return "—";
  }

  if (value >= 1000) {
    const compact = value / 1000;

    return `${compact
      .toFixed(
        compact >= 10 ? 0 : 1,
      )
      .replace(".", ",")}K`;
  }

  return String(value);
}

export function ProfileHighlightCard({
  video,
}: Props) {
  return (
    <View style={styles.container}>
      {video.thumbnailUrl ? (
        <Image
          source={{
            uri: video.thumbnailUrl,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons
            name="videocam-outline"
            size={18}
            color="#52677D"
          />
        </View>
      )}

      <View style={styles.shade} />

      <View style={styles.copy}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {video.title}
        </Text>

        <View style={styles.views}>
          <Ionicons
            name="play"
            size={8}
            color="#FFFFFF"
          />

          <Text style={styles.viewsText}>
            {formatViewers(
              video.viewerCount,
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",

    aspectRatio: 0.92,

    overflow: "hidden",

    borderRadius: 8,

    backgroundColor: "#111C27",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    ...StyleSheet.absoluteFill,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#14202C",
  },

  shade: {
    ...StyleSheet.absoluteFill,

    backgroundColor:
      "rgba(0,0,0,0.23)",
  },

  copy: {
    position: "absolute",

    left: 6,
    right: 6,
    bottom: 6,
  },

  title: {
    color: "#FFFFFF",

    fontSize: 9,
    lineHeight: 11,

    fontWeight: "700",
  },

  views: {
    marginTop: 3,

    flexDirection: "row",
    alignItems: "center",

    gap: 2,
  },

  viewsText: {
    color: "#FFFFFF",

    fontSize: 8,

    fontWeight: "600",
  },
});