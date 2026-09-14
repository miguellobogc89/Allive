// src/components/profile/mock/ProfileMockLatestLive.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  type ProfileLive,
} from "../../../api/profileApi";

type Props = {
  live: ProfileLive;
};

function formatElapsedTime(
  endedAt: string | null,
) {
  if (!endedAt) {
    return "Emitido recientemente";
  }

  const ended =
    new Date(endedAt).getTime();

  const now =
    Date.now();

  const difference =
    Math.max(
      0,
      now - ended,
    );

  const minutes =
    Math.floor(
      difference / 60000,
    );

  if (minutes < 1) {
    return "Emitido ahora";
  }

  if (minutes < 60) {
    return `Emitido hace ${minutes} min`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    if (hours === 1) {
      return "Emitido hace 1 hora";
    }

    return `Emitido hace ${hours} horas`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  if (days === 1) {
    return "Emitido hace 1 día";
  }

  return `Emitido hace ${days} días`;
}

function formatDuration(
  startedAt: string,
  endedAt: string | null,
) {
  if (!endedAt) {
    return "";
  }

  const start =
    new Date(startedAt).getTime();

  const end =
    new Date(endedAt).getTime();

  const totalSeconds =
    Math.max(
      0,
      Math.floor(
        (end - start) / 1000,
      ),
    );

  const hours =
    Math.floor(
      totalSeconds / 3600,
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60,
    );

  const seconds =
    totalSeconds % 60;

  const paddedMinutes =
    String(minutes).padStart(
      2,
      "0",
    );

  const paddedSeconds =
    String(seconds).padStart(
      2,
      "0",
    );

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}

export function ProfileMockLatestLive({
  live,
}: Props) {
  const title =
    live.title ||
    "Directo sin título";

  const elapsedTime =
    formatElapsedTime(
      live.endedAt,
    );

  const duration =
    formatDuration(
      live.startedAt,
      live.endedAt,
    );

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>
        Tu último directo
      </Text>

      <View style={styles.card}>
        {live.thumbnailUrl && (
          <Image
            source={{
              uri: live.thumbnailUrl,
            }}
            resizeMode="cover"
            style={styles.thumbnail}
          />
        )}

        {!live.thumbnailUrl && (
          <View style={styles.placeholder}>
            <Ionicons
              name="videocam-outline"
              size={28}
              color="rgba(255,255,255,0.28)"
            />

            <Text
              style={
                styles.placeholderText
              }
            >
              Último directo
            </Text>
          </View>
        )}

        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0.03)",
            "rgba(0,0,0,0.10)",
            "rgba(0,0,0,0.24)",
            "rgba(0,0,0,0.45)",
            "rgba(0,0,0,0.68)",
            "rgba(0,0,0,0.88)",
          ]}
          locations={[
            0,
            0.18,
            0.34,
            0.5,
            0.66,
            0.83,
            1,
          ]}
          start={{
            x: 0.5,
            y: 0,
          }}
          end={{
            x: 0.5,
            y: 1,
          }}
          style={
            styles.bottomGradient
          }
        />

        <View style={styles.badge}>
          <View
            style={styles.badgeDot}
          />

          <Text
            style={styles.badgeText}
          >
            {elapsedTime}
          </Text>
        </View>

        {duration.length > 0 && (
          <View
            style={styles.duration}
          >
            <Text
              style={
                styles.durationText
              }
            >
              {duration}
            </Text>
          </View>
        )}

        <View style={styles.info}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>

          {live.placeName && (
            <Text
              style={styles.meta}
              numberOfLines={1}
            >
              {live.placeName}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    minHeight: 0,
    paddingTop: 16,
  },

  heading: {
    flexShrink: 0,
    marginBottom: 9,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  card: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: 11,
    backgroundColor: "#152536",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
  },

  thumbnail: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  placeholder: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#17293A",
  },

  placeholderText: {
    color:
      "rgba(255,255,255,0.32)",
    fontSize: 11,
  },

  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "42%",
  },

  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor:
      "rgba(74,27,31,0.78)",
  },

  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#FFADB3",
  },

  badgeText: {
    color: "#FFD7D9",
    fontSize: 9,
    fontWeight: "600",
  },

  duration: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor:
      "rgba(5,12,19,0.76)",
  },

  durationText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "600",
  },

  info: {
    position: "absolute",
    left: 11,
    right: 11,
    bottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  meta: {
    marginTop: 3,
    color: "#D0D9E2",
    fontSize: 10,
  },
});