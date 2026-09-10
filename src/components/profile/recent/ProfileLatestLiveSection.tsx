// src/components/profile/recent/ProfileLatestLiveSection.tsx

import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { ProfileVideoItem } from "../profileTypes";
import { LatestLiveCard } from "./LatestLiveCard";

type Props = {
  video?: ProfileVideoItem;
};

export function ProfileLatestLiveSection({ video }: Props) {
  if (!video) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.heading}>Tu último directo</Text>

        <Pressable style={styles.action}>
          <Text style={styles.actionText}>Ver todos</Text>
          <Ionicons name="chevron-forward" size={13} color="#C7D4E2" />
        </Pressable>
      </View>

      <LatestLiveCard video={video} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },

  header: {
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  actionText: {
    color: "#C7D4E2",
    fontSize: 10,
    fontWeight: "600",
  },
});
