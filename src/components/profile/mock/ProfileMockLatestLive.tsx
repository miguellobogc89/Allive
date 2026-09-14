// src/components/profile/mock/ProfileMockLatestLive.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export function ProfileMockLatestLive() {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>
        Tu último directo
      </Text>

      <View style={styles.card}>
        <View style={styles.placeholder}>
          <Ionicons
            name="videocam-outline"
            size={28}
            color="rgba(255,255,255,0.28)"
          />

          <Text style={styles.placeholderText}>
            Último directo
          </Text>
        </View>

        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0.03)",
            "rgba(0,0,0,0.10)",
            "rgba(0,0,0,0.24)",
            "rgba(0,0,0,0.45)",
            "rgba(0,0,0,0.68)",
            "rgba(0,0,0,0.88)",
          ]}
          locations={[
            0,
            0.18,
            0.34,
            0.5,
            0.66,
            0.83,
            1,
          ]}
          start={{
            x: 0.5,
            y: 0,
          }}
          end={{
            x: 0.5,
            y: 1,
          }}
          style={styles.bottomGradient}
        />

        <View style={styles.badge}>
          <View style={styles.badgeDot} />

          <Text style={styles.badgeText}>
            Emitido hace 2 días
          </Text>
        </View>

        <View style={styles.duration}>
          <Text style={styles.durationText}>
            1:28:15
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>
            Atardeceres que sanan
          </Text>

          <Text style={styles.meta}>
            Conversación · Madrid
          </Text>

          <View style={styles.metrics}>
            <Ionicons
              name="play"
              size={11}
              color="#FFFFFF"
            />

            <Text style={styles.metric}>
              412K
            </Text>

            <Ionicons
              name="heart-outline"
              size={11}
              color="#FFFFFF"
            />

            <Text style={styles.metric}>
              4.2K
            </Text>

            <Ionicons
              name="chatbubble-outline"
              size={10}
              color="#FFFFFF"
            />

            <Text style={styles.metric}>
              2.2K
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    minHeight: 0,
    paddingTop: 16,
  },

  heading: {
    flexShrink: 0,
    marginBottom: 9,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  card: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: 11,
    backgroundColor: "#152536",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  placeholder: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#17293A",
  },

  placeholderText: {
    color: "rgba(255,255,255,0.32)",
    fontSize: 11,
  },

  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "42%",
  },

  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(74,27,31,0.78)",
  },

  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#FFADB3",
  },

  badgeText: {
    color: "#FFD7D9",
    fontSize: 9,
    fontWeight: "600",
  },

  duration: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "rgba(5,12,19,0.76)",
  },

  durationText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "600",
  },

  info: {
    position: "absolute",
    left: 11,
    right: 11,
    bottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  meta: {
    marginTop: 3,
    color: "#D0D9E2",
    fontSize: 10,
  },

  metrics: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  metric: {
    marginRight: 4,
    color: "#FFFFFF",
    fontSize: 9,
  },
});