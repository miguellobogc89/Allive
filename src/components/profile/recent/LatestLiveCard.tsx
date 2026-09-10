// src/components/profile/recent/LatestLiveCard.tsx

import { Ionicons } from "@expo/vector-icons";

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ProfileVideoItem } from "../profileTypes";

type Props = {
  video: ProfileVideoItem;
  onPress?: () => void;
};

function formatViewers(
  value?: number,
) {
  if (value === undefined) {
    return "—";
  }

  if (value >= 1000) {
    const compact =
      value / 1000;

    return `${compact
      .toFixed(
        compact >= 10 ? 0 : 1,
      )
      .replace(".", ",")}K`;
  }

  return String(value);
}

function relativeTime(
  value: string | null,
  fallback: string,
) {
  const source =
    value ?? fallback;

  const timestamp =
    new Date(source).getTime();

  if (!Number.isFinite(timestamp)) {
    return "Emitido recientemente";
  }

  const hours = Math.max(
    1,
    Math.floor(
      (Date.now() - timestamp) /
        3600000,
    ),
  );

  if (hours < 24) {
    return `Emitido hace ${hours} h`;
  }

  const days =
    Math.floor(hours / 24);

  return `Emitido hace ${days} ${
    days === 1 ? "día" : "días"
  }`;
}

export function LatestLiveCard({
  video,
  onPress,
}: Props) {
  const isLive =
    video.endedAt === null;

  const hasThumbnail =
    Boolean(video.thumbnailUrl);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      {hasThumbnail ? (
        <>
          {/* Fondo ambiental.
              Rellena la tarjeta aunque
              el LIVE sea vertical. */}
          <Image
            source={{
              uri: video.thumbnailUrl!,
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
            blurRadius={18}
          />

          <View
            style={
              styles.backgroundShade
            }
          />

          {/* Imagen real.
              Siempre se muestra completa. */}
          <Image
            source={{
              uri: video.thumbnailUrl!,
            }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </>
      ) : (
        <View
          style={styles.placeholder}
        >
          <Ionicons
            name="videocam-outline"
            size={34}
            color="#52677D"
          />
        </View>
      )}

      <View style={styles.edgeShade} />

      <View
        style={[
          styles.status,
          isLive &&
            styles.liveStatus,
        ]}
      >
        <View
          style={[
            styles.dot,
            isLive && styles.liveDot,
          ]}
        />

        <Text style={styles.statusText}>
          {isLive
            ? "EN DIRECTO"
            : relativeTime(
                video.endedAt,
                video.startedAt,
              )}
        </Text>
      </View>

      <View style={styles.copyShade} />

      <View style={styles.copy}>
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

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Ionicons
              name="play-outline"
              size={12}
              color="#FFFFFF"
            />

            <Text
              style={styles.metricText}
            >
              {formatViewers(
                video.viewerCount,
              )}
            </Text>
          </View>

          <View style={styles.metric}>
            <Ionicons
              name="eye-outline"
              size={12}
              color="#FFFFFF"
            />

            <Text
              style={styles.metricText}
            >
              {formatViewers(
                video.viewerCount,
              )}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",

    aspectRatio: 16 / 9,

    overflow: "hidden",

    borderRadius: 14,

    backgroundColor: "#09131D",

    borderWidth: 1,
    borderColor: "#1B2C3D",
  },

  pressed: {
    opacity: 0.84,
  },

  backgroundImage: {
    ...StyleSheet.absoluteFill,

    width: "100%",
    height: "100%",

    transform: [
      {
        scale: 1.12,
      },
    ],
  },

  backgroundShade: {
    ...StyleSheet.absoluteFill,

    backgroundColor:
      "rgba(2,8,14,0.38)",
  },

  mainImage: {
    ...StyleSheet.absoluteFill,

    width: "100%",
    height: "100%",
  },

  placeholder: {
    ...StyleSheet.absoluteFill,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#121D28",
  },

  edgeShade: {
    ...StyleSheet.absoluteFill,

    backgroundColor:
      "rgba(0,0,0,0.08)",
  },

  status: {
    position: "absolute",

    left: 10,
    top: 10,

    minHeight: 23,

    paddingHorizontal: 8,

    borderRadius: 6,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    backgroundColor:
      "rgba(88,45,48,0.86)",
  },

  liveStatus: {
    backgroundColor: "#E83B3B",
  },

  dot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor: "#F1A7AA",
  },

  liveDot: {
    backgroundColor: "#FFFFFF",
  },

  statusText: {
    color: "#FFFFFF",

    fontSize: 9,

    fontWeight: "700",
  },

  copyShade: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    height: "48%",

    backgroundColor:
      "rgba(2,8,14,0.38)",
  },

  copy: {
    position: "absolute",

    left: 11,
    right: 11,
    bottom: 10,
  },

  title: {
    color: "#FFFFFF",

    fontSize: 14,
    lineHeight: 17,

    fontWeight: "800",
  },

  place: {
    marginTop: 2,

    color: "#D2DAE3",

    fontSize: 10,

    fontWeight: "500",
  },

  metrics: {
    marginTop: 6,

    flexDirection: "row",

    gap: 12,
  },

  metric: {
    flexDirection: "row",
    alignItems: "center",

    gap: 4,
  },

  metricText: {
    color: "#FFFFFF",

    fontSize: 9,

    fontWeight: "600",
  },
});