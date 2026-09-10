// src/components/profile/stats/ProfileStats.tsx

import { StyleSheet, View } from "react-native";
import { ProfileStatCard } from "./ProfileStatCard";

type Props = {
  hoursLive: string;
  community: string;
  totalViews: string;
  liveScore: string;
};

export function ProfileStats({
  hoursLive,
  community,
  totalViews,
  liveScore,
}: Props) {
  return (
    <View style={styles.container}>
      <ProfileStatCard
        icon="time-outline"
        value={hoursLive}
        label="Horas en directo"
      />
      <ProfileStatCard
        icon="people-outline"
        value={community}
        label="Comunidad"
      />
      <ProfileStatCard
        icon="eye-outline"
        value={totalViews}
        label="Vistas totales"
      />
      <ProfileStatCard
        icon="flash-outline"
        value={liveScore}
        label="Live Score"
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
