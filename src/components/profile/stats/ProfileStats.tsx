// src/components/profile/stats/ProfileStats.tsx

import {
  StyleSheet,
  View,
} from "react-native";

import {
  ProfileStatCard,
} from "./ProfileStatCard";

type Props = {
  followers: string;
  emissions: string;
  averageViewers: string;
};

export function ProfileStats({
  followers,
  emissions,
  averageViewers,
}: Props) {
  return (
    <View style={styles.container}>
      <ProfileStatCard
        icon="people-outline"
        value={followers}
        label="Seguidores"
      />

      <ProfileStatCard
        icon="time-outline"
        value={emissions}
        label="Emisiones"
      />

      <ProfileStatCard
        icon="eye-outline"
        value={averageViewers}
        label="Media espectadores"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 7,
    marginTop: 14,
  },
});