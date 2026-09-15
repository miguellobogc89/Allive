// src/components/profile/mock/ProfileMockHighlights.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  type ProfileLive,
} from "../../../api/profileApi";

import {
  ProfileMockHighlightCard,
} from "./ProfileMockHighlightCard";

type Props = {
  lives: ProfileLive[];
  expanded: boolean;
  onPressViewAll: () => void;
};

export function ProfileMockHighlights({
  lives,
  expanded,
  onPressViewAll,
}: Props) {
  const canExpand =
    lives.length > 4;

  let visibleLives =
    lives.slice(0, 4);

  if (expanded) {
    visibleLives =
      lives.slice(0, 16);
  }

  let viewAllText =
    "Ver todos";

  let viewAllIcon:
    "chevron-up" |
    "chevron-forward" =
    "chevron-forward";

  if (expanded) {
    viewAllText =
      "Ver menos";

    viewAllIcon =
      "chevron-up";
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
            <Text
              style={
                styles.viewAllText
              }
            >
              {viewAllText}
            </Text>

            <Ionicons
              name={viewAllIcon}
              size={13}
              color="#24B8FF"
            />
          </Pressable>
        )}
      </View>

      <View style={styles.grid}>
        {visibleLives.map(
          (live) => (
            <View
              key={live.id}
              style={styles.item}
            >
              <ProfileMockHighlightCard
                live={live}
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