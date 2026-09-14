// src/components/profile/highlights/ProfileHighlightsSection.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useState,
} from "react";

import type { ProfileVideoItem } from "../profileTypes";
import { ProfileHighlightCard } from "./ProfileHighlightCard";

type Props = {
  videos: ProfileVideoItem[];
};

export function ProfileHighlightsSection({
  videos,
}: Props) {
  const [
    expanded,
    setExpanded,
  ] = useState(false);

  if (videos.length === 0) {
    return null;
  }

  let visibleVideos =
    videos.slice(0, 3);

  if (expanded) {
    visibleVideos = videos;
  }

  const canExpand =
    videos.length > 3;

  let actionText =
    "Ver todos";

  let actionIcon:
    "chevron-down" |
    "chevron-up" =
      "chevron-down";

  if (expanded) {
    actionText =
      "Ver menos";

    actionIcon =
      "chevron-up";
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          Momentos destacados
        </Text>

        {canExpand && (
          <Pressable
            onPress={() => {
              setExpanded(
                !expanded,
              );
            }}
            style={({ pressed }) => [
              styles.action,
              pressed &&
                styles.actionPressed,
            ]}
          >
            <Text
              style={styles.actionText}
            >
              {actionText}
            </Text>

            <Ionicons
              name={actionIcon}
              size={12}
              color="#38AFFF"
            />
          </Pressable>
        )}
      </View>

      <View style={styles.grid}>
        {visibleVideos.map(
          (video) => (
            <View
              key={video.id}
              style={styles.gridItem}
            >
              <ProfileHighlightCard
                video={video}
              />
            </View>
          ),
        )}
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
    justifyContent:
      "space-between",
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

  actionPressed: {
    opacity: 0.65,
  },

  actionText: {
    color: "#38AFFF",
    fontSize: 9,
    fontWeight: "600",
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  gridItem: {
    width: "31.8%",
  },
});