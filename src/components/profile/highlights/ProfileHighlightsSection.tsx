// src/components/profile/highlights/ProfileHighlightsSection.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ProfileVideoItem } from "../profileTypes";
import { ProfileHighlightCard } from "./ProfileHighlightCard";

type Props = {
  videos: ProfileVideoItem[];
  onPressViewAll?: () => void;
};

export function ProfileHighlightsSection({
  videos,
  onPressViewAll,
}: Props) {
  if (videos.length === 0) {
    return null;
  }

  const visibleVideos = videos.slice(0, 3);
  const canViewAll = videos.length > 3;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          Momentos destacados
        </Text>

        <Pressable
          disabled={!canViewAll}
          onPress={
            canViewAll
              ? onPressViewAll
              : undefined
          }
          style={({ pressed }) => [
            styles.action,
            !canViewAll &&
              styles.actionDisabled,
            pressed &&
              canViewAll &&
              styles.actionPressed,
          ]}
        >
          <Text
            style={[
              styles.actionText,
              !canViewAll &&
                styles.actionTextDisabled,
            ]}
          >
            Ver todos
          </Text>

          <Ionicons
            name="chevron-forward"
            size={12}
            color={
              canViewAll
                ? "#38AFFF"
                : "#526171"
            }
          />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {visibleVideos.map((video) => (
          <View
            key={video.id}
            style={styles.gridItem}
          >
            <ProfileHighlightCard
              video={video}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
  },

  header: {
    marginBottom: 7,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heading: {
    color: "#FFFFFF",

    fontSize: 14,
    lineHeight: 17,

    fontWeight: "800",
  },

  action: {
    flexDirection: "row",
    alignItems: "center",

    gap: 2,
  },

  actionDisabled: {
    opacity: 0.55,
  },

  actionPressed: {
    opacity: 0.65,
  },

  actionText: {
    color: "#38AFFF",

    fontSize: 9,

    fontWeight: "600",
  },

  actionTextDisabled: {
    color: "#526171",
  },

  grid: {
    width: "100%",

    flexDirection: "row",

    gap: 8,
  },

  gridItem: {
    flex: 1,
    maxWidth: "33.333%",
  },
});