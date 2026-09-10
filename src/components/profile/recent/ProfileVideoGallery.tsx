// src/components/profile/recent/ProfileVideoGallery.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ProfileVideoCard } from "./ProfileVideoCard";
import type { ProfileVideoItem } from "../profileTypes";

type Props = {
  videos: ProfileVideoItem[];
};

export function ProfileVideoGallery({
  videos,
}: Props) {
  if (videos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Últimas emisiones
        </Text>

        <View style={styles.empty}>
          <Ionicons
            name="radio-outline"
            size={28}
            color="#42536A"
          />

          <Text style={styles.emptyTitle}>
            Aún no hay directos
          </Text>

          <Text style={styles.emptyText}>
            Tus emisiones aparecerán aquí.
          </Text>
        </View>
      </View>
    );
  }

  const [featured, ...rest] = videos;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            HISTORIAL
          </Text>

          <Text style={styles.title}>
            Últimas emisiones
          </Text>
        </View>

        {videos.length > 1 && (
          <Pressable style={styles.action}>
            <Text style={styles.actionText}>
              Ver todas
            </Text>

            <Ionicons
              name="arrow-forward"
              size={14}
              color="#459CFF"
            />
          </Pressable>
        )}
      </View>

      <ProfileVideoCard
        video={featured}
        featured
      />

      {rest.slice(0, 3).map((video) => (
        <ProfileVideoCard
          key={video.id}
          video={video}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },

  header: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  eyebrow: {
    marginBottom: 4,
    color: "#3D98FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
  },

  actionText: {
    color: "#459CFF",
    fontSize: 11,
    fontWeight: "700",
  },

  empty: {
    marginTop: 14,
    minHeight: 160,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101720",
    borderWidth: 1,
    borderColor: "#1C2938",
  },

  emptyTitle: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: 4,
    color: "#68778B",
    fontSize: 11,
  },
});