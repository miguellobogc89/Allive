// src/components/profile/mock/ProfileMockStats.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

const stats = [
  {
    icon: "people-outline" as const,
    value: "12.4K",
    label: "Seguidores",
  },
  {
    icon: "videocam-outline" as const,
    value: "320",
    label: "Emisiones",
  },
  {
    icon: "eye-outline" as const,
    value: "1.2M",
    label: "Vistas totales",
  },
  {
    icon: "flash-outline" as const,
    value: "4.9",
    label: "Live score",
  },
];

export function ProfileMockStats() {
  return (
    <View style={styles.row}>
      {stats.map((stat) => (
        <View
          key={stat.label}
          style={styles.card}
        >
          <View style={styles.valueRow}>
            <Ionicons
              name={stat.icon}
              size={14}
              color="#21B5FF"
            />

            <Text style={styles.value}>
              {stat.value}
            </Text>
          </View>

          <Text style={styles.label}>
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 7,
    marginTop: 10,
  },

  card: {
    flex: 1,
    minWidth: 0,
    height: 61,
    paddingHorizontal: 9,
    paddingVertical: 9,
    borderRadius: 11,
    borderWidth: 1,
    borderColor:
      "rgba(82,151,204,0.22)",
    backgroundColor: "#0D1C2B",
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  label: {
    marginTop: 6,
    color: "#9CADBD",
    fontSize: 8,
    fontWeight: "500",
  },
});