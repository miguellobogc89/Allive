// src/components/profile/stats/ProfileStatCard.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type IconName =
  | "time-outline"
  | "people-outline"
  | "eye-outline"
  | "flash-outline";

type Props = {
  value: string;
  label: string;
  icon: IconName;
};

export function ProfileStatCard({ value, label, icon }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.valueRow}>
        <Ionicons name={icon} size={14} color="#2AA3FF" />
        <Text style={styles.value}>{value}</Text>
      </View>

      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 62,
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#101B27",
    borderWidth: 1,
    borderColor: "#1D3144",
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  label: {
    marginTop: 5,
    color: "#8E9CAF",
    fontSize: 9,
    lineHeight: 12,
    fontWeight: "500",
  },
});
