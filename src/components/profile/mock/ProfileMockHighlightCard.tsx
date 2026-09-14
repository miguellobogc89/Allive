// src/components/profile/mock/ProfileMockHighlightCard.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  ProfileVideoItem,
} from "../profileTypes";

type Props = {
  video: ProfileVideoItem;
};

function formatViews(
  value?: number,
) {
  if (!value) {
    return "—";
  }

  if (value >= 1000) {
    return `${Math.round(
      value / 1000,
    )}K`;
  }

  return String(value);
}

export function ProfileMockHighlightCard({
  video,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.placeholder}>
        <Ionicons
          name="videocam-outline"
          size={20}
          color="rgba(255,255,255,0.22)"
        />
      </View>

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
        style={styles.bottomGradient}
      />

      <View style={styles.bottom}>
        <Text
          numberOfLines={1}
          style={styles.title}
        >
          {video.title}
        </Text>

        <View style={styles.views}>
          <Ionicons
            name="play"
            size={9}
            color="#FFFFFF"
          />

          <Text style={styles.viewsText}>
            {formatViews(
              video.viewerCount,
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 9,
    backgroundColor: "#17293A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  placeholder: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "42%",
  },

  bottom: {
    position: "absolute",
    left: 7,
    right: 7,
    bottom: 6,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },

  views: {
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  viewsText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "600",
  },
});