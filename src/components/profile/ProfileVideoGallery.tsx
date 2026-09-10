// src/components/profile/ProfileVideoGallery.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ProfileVideoCard } from "./ProfileVideoCard";
import type { ProfileVideoItem } from "./profileTypes";

type Props = {
  videos: ProfileVideoItem[];
};

export function ProfileVideoGallery({
  videos,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Emisiones recientes
        </Text>

        <Text style={styles.action}>
          Ver todo
        </Text>
      </View>

      <View style={styles.grid}>
        {videos.map((video) => (
          <ProfileVideoCard
            key={video.id}
            video={video}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  title: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
  },

  action: {
    color: "#0095F6",
    fontSize: 12,
    fontWeight: "700",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
