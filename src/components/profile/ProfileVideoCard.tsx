// src/components/profile/ProfileVideoCard.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ProfileVideoItem } from "./profileTypes";

type Props = {
  video: ProfileVideoItem;
  onPress?: () => void;
};

function formatViewers(value?: number) {
  if (value === undefined) {
    return "—";
  }

  if (value >= 1000) {
    const compact = value / 1000;

    return `${compact
      .toFixed(compact >= 10 ? 0 : 1)
      .replace(".", ",")}K`;
  }

  return String(value);
}

function formatRelativeDate(value: string) {
  const timestamp = new Date(value).getTime();

  if (!Number.isFinite(timestamp)) {
    return value;
  }

  const difference = Math.max(
    0,
    Date.now() - timestamp,
  );

  const hours = Math.floor(
    difference / 3600000,
  );

  if (hours < 1) {
    return "Hace unos minutos";
  }

  if (hours < 24) {
    return `Hace ${hours} ${
      hours === 1 ? "hora" : "horas"
    }`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `Hace ${days} ${
      days === 1 ? "día" : "días"
    }`;
  }

  return new Date(value).toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "short",
    },
  );
}

export function ProfileVideoCard({
  video,
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.thumbnail}>
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
              name="videocam"
              size={30}
              color="#A8A8A8"
            />

            <View style={styles.placeholderLine} />
            <View style={styles.placeholderLineShort} />
          </View>
        )}

        <View style={styles.viewerBadge}>
          <Ionicons
            name="eye"
            size={12}
            color="#FFFFFF"
          />
          <Text style={styles.viewerText}>
            {formatViewers(
              video.viewerCount,
            )}
          </Text>
        </View>
      </View>

      <Text
        style={styles.title}
        numberOfLines={1}
      >
        {video.title}
      </Text>

      <Text
        style={styles.place}
        numberOfLines={1}
      >
        {video.placeName}
      </Text>

      <Text style={styles.date}>
        {formatRelativeDate(
          video.startedAt,
        )}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48.7%",
    marginBottom: 20,
  },

  thumbnail: {
    width: "100%",
    aspectRatio: 4 / 5,
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEEEEE",
  },

  placeholderLine: {
    width: "55%",
    height: 5,
    marginTop: 13,
    borderRadius: 3,
    backgroundColor: "#D7D7D7",
  },

  placeholderLineShort: {
    width: "35%",
    height: 5,
    marginTop: 6,
    borderRadius: 3,
    backgroundColor: "#D7D7D7",
  },

  viewerBadge: {
    position: "absolute",
    right: 7,
    bottom: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: "rgba(0,0,0,0.68)",
  },

  viewerText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  title: {
    marginTop: 8,
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },

  place: {
    marginTop: 2,
    color: "#737373",
    fontSize: 11,
  },

  date: {
    marginTop: 3,
    color: "#A0A0A0",
    fontSize: 10,
  },
});
