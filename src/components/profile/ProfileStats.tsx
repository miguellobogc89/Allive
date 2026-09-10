// src/components/profile/ProfileStats.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  liveScore: string;
  emissions: string;
  averageViewers: string;
};

export function ProfileStats({
  liveScore,
  emissions,
  averageViewers,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.value}>
          {liveScore}
        </Text>
        <Text style={styles.label}>
          Live Score
        </Text>
      </View>

      <View style={styles.stat}>
        <Text style={styles.value}>
          {emissions}
        </Text>
        <Text style={styles.label}>
          Emisiones
        </Text>
      </View>

      <View style={styles.stat}>
        <Text style={styles.value}>
          {averageViewers}
        </Text>
        <Text style={styles.label}>
          Media espectadores
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
  },

  stat: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },

  value: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "800",
  },

  label: {
    marginTop: 4,
    color: "#737373",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
  },
});
