// src/components/profile/recent/ProfileVideoCard.tsx

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
  featured?: boolean;
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

function getAge(value: string) {
  const timestamp = new Date(value).getTime();

  if (!Number.isFinite(timestamp)) {
    return value;
  }

  const difference = Math.max(
    0,
    Date.now() - timestamp,
  );

  const minutes = Math.floor(
    difference / 60000,
  );

  if (minutes < 60) {
    return `HACE ${Math.max(1, minutes)} MIN`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `HACE ${hours} H`;
  }

  const days = Math.floor(hours / 24);

  return `HACE ${days} D`;
}

export function ProfileVideoCard({
  video,
  featured = false,
  onPress,
}: Props) {
  const isLive = video.endedAt === null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        featured && styles.featuredContainer,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.thumbnail,
          featured && styles.featuredThumbnail,
        ]}
      >
        {video.thumbnailUrl ? (
          <Image
            source={{ uri: video.thumbnailUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.placeholderIcon}>
              <Ionicons
                name="videocam-outline"
                size={26}
                color="#58708D"
              />
            </View>
          </View>
        )}

        <View style={styles.shade} />

        <View
          style={[
            styles.statusBadge,
            isLive
              ? styles.liveBadge
              : styles.replayBadge,
          ]}
        >
          {isLive && (
            <View style={styles.liveDot} />
          )}

          <Text style={styles.statusText}>
            {isLive
              ? "LIVE"
              : getAge(video.endedAt ?? video.startedAt)}
          </Text>
        </View>

        <View style={styles.viewerBadge}>
          <Ionicons
            name="eye-outline"
            size={13}
            color="#FFFFFF"
          />

          <Text style={styles.viewerText}>
            {formatViewers(video.viewerCount)}
          </Text>
        </View>

        {featured && (
          <View style={styles.featuredCopy}>
            <Text
              style={styles.featuredTitle}
              numberOfLines={2}
            >
              {video.title}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={13}
                color="rgba(255,255,255,0.75)"
              />

              <Text
                style={styles.featuredLocation}
                numberOfLines={1}
              >
                {video.placeName}
              </Text>
            </View>
          </View>
        )}
      </View>

      {!featured && (
        <View style={styles.copy}>
          <View style={styles.copyMain}>
            <Text
              style={styles.title}
              numberOfLines={1}
            >
              {video.title}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={12}
                color="#66768B"
              />

              <Text
                style={styles.location}
                numberOfLines={1}
              >
                {video.placeName}
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#445268"
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#101720",
    borderWidth: 1,
    borderColor: "#1B2736",
  },

  featuredContainer: {
    borderColor: "#253A52",
  },

  pressed: {
    opacity: 0.82,
  },

  thumbnail: {
    height: 118,
    overflow: "hidden",
    backgroundColor: "#111923",
  },

  featuredThumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    height: undefined,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111923",
  },

  placeholderIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#182434",
  },

shade: {
  ...StyleSheet.absoluteFill,
  backgroundColor: "rgba(0,0,0,0.18)",
},

  statusBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    minHeight: 25,
    paddingHorizontal: 9,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  liveBadge: {
    backgroundColor: "#FF3B30",
  },

  replayBadge: {
    backgroundColor: "rgba(7,12,19,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  viewerBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    minHeight: 25,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(7,12,19,0.72)",
  },

  viewerText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  featuredCopy: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
  },

  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  featuredLocation: {
    flexShrink: 1,
    color: "rgba(255,255,255,0.78)",
    fontSize: 11,
    fontWeight: "600",
  },

  copy: {
    minHeight: 62,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  copyMain: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    color: "#EAF0F7",
    fontSize: 13,
    fontWeight: "800",
  },

  locationRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  location: {
    flexShrink: 1,
    color: "#66768B",
    fontSize: 11,
    fontWeight: "500",
  },
});