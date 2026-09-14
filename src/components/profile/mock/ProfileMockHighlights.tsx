// src/components/profile/mock/ProfileMockHighlights.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ProfileMockHighlightCard,
} from "./ProfileMockHighlightCard";

import {
  profileMockVideos,
} from "./profileMockData";

type Props = {
  expanded: boolean;
  onPressViewAll: () => void;
};

export function ProfileMockHighlights({
  expanded,
  onPressViewAll,
}: Props) {
  const videos =
    profileMockVideos.slice(1);

  const canExpand =
    videos.length > 4;

  let visibleVideos =
    videos.slice(0, 4);

  if (expanded) {
    visibleVideos =
      videos.slice(0, 16);
  }

  return (
    <View style={styles.footer}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          Momentos destacados
        </Text>

        {canExpand && (
          <Pressable
            onPress={onPressViewAll}
            hitSlop={10}
            style={({ pressed }) => {
              if (pressed) {
                return [
                  styles.viewAll,
                  styles.viewAllPressed,
                ];
              }

              return styles.viewAll;
            }}
          >
            <Text style={styles.viewAllText}>
              {expanded
                ? "Ver menos"
                : "Ver todos"}
            </Text>

            <Ionicons
              name={
                expanded
                  ? "chevron-up"
                  : "chevron-forward"
              }
              size={13}
              color="#24B8FF"
            />
          </Pressable>
        )}
      </View>

      <View style={styles.grid}>
        {visibleVideos.map(
          (video) => (
            <View
              key={video.id}
              style={styles.item}
            >
              <ProfileMockHighlightCard
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
  footer: {
    width: "100%",
    paddingTop: 12,
    marginBottom: -10,
  },

  header: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  viewAllPressed: {
    opacity: 0.55,
  },

  viewAllText: {
    color: "#24B8FF",
    fontSize: 10,
    fontWeight: "700",
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 7,
    rowGap: 7,
  },

  item: {
    width: "23%",
    aspectRatio: 1,
    flexGrow: 0,
    flexShrink: 0,
  },
});