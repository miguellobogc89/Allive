// src/components/profile/LiveScoreCard.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  score: string;
};

export function LiveScoreCard({
  score,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons
          name="pulse"
          size={19}
          color="#0095F6"
        />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>
          Live Score
        </Text>
        <Text style={styles.description}>
          Rendimiento global de tus emisiones
        </Text>
      </View>

      <View style={styles.scoreRow}>
        <Text style={styles.score}>
          {score}
        </Text>
        <Text style={styles.max}>
          /10
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#FFFFFF",
  },

  icon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF8FF",
  },

  copy: {
    flex: 1,
    marginLeft: 11,
  },

  title: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "800",
  },

  description: {
    marginTop: 2,
    color: "#737373",
    fontSize: 11,
  },

  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  score: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "900",
  },

  max: {
    color: "#A0A0A0",
    fontSize: 11,
    fontWeight: "700",
  },
});
