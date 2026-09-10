// src/components/profile/score/LiveScoreCard.tsx

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
  const numericScore = Math.max(
    0,
    Math.min(10, Number(score) || 0),
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <View style={styles.icon}>
            <Ionicons
              name="pulse"
              size={19}
              color="#459CFF"
            />
          </View>

          <View>
            <Text style={styles.title}>
              Live Score
            </Text>

            <Text style={styles.subtitle}>
              Tu impacto en directo
            </Text>
          </View>
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

      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            {
              width: `${numericScore * 10}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    padding: 17,
    borderRadius: 18,
    backgroundColor: "#101720",
    borderWidth: 1,
    borderColor: "#1C2938",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(35,134,255,0.13)",
    marginRight: 11,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 3,
    color: "#738095",
    fontSize: 11,
    fontWeight: "500",
  },

  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  score: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  max: {
    color: "#627086",
    fontSize: 11,
    fontWeight: "700",
  },

  track: {
    height: 5,
    marginTop: 16,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: "#202B39",
  },

  progress: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#2386FF",
  },
});