// src/screens/MapScreen.web.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

const clusters = [
  {
    id: "madrid",
    city: "Madrid",
    lives: "1.284",
    top: "31%",
    left: "45%",
    size: 82,
  },
  {
    id: "barcelona",
    city: "Barcelona",
    lives: "846",
    top: "34%",
    left: "73%",
    size: 74,
  },
  {
    id: "valencia",
    city: "Valencia",
    lives: "271",
    top: "48%",
    left: "63%",
    size: 64,
  },
  {
    id: "sevilla",
    city: "Sevilla",
    lives: "318",
    top: "66%",
    left: "32%",
    size: 68,
  },
  {
    id: "malaga",
    city: "Málaga",
    lives: "164",
    top: "76%",
    left: "39%",
    size: 60,
  },
  {
    id: "chiclana",
    city: "Chiclana",
    lives: "37",
    top: "73%",
    left: "25%",
    size: 54,
  },
];

export function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.fakeMap}>
        <View style={styles.seaLeft} />
        <View style={styles.seaRight} />

        <Text style={[styles.mapLabel, styles.portugal]}>
          PORTUGAL
        </Text>

        <Text style={[styles.mapLabel, styles.spain]}>
          ESPAÑA
        </Text>

        {clusters.map((cluster) => (
          <View
            key={cluster.id}
            style={[
              styles.cluster,
              {
                top: cluster.top as any,
                left: cluster.left as any,
                width: cluster.size,
                height: cluster.size,
                borderRadius: cluster.size / 2,
                marginLeft: -(cluster.size / 2),
                marginTop: -(cluster.size / 2),
              },
            ]}
          >
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />

              <Text style={styles.clusterNumber}>
                {cluster.lives}
              </Text>
            </View>

            <Text style={styles.clusterCity}>
              {cluster.city}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ahora</Text>

          <View style={styles.totalLive}>
            <View style={styles.headerLiveDot} />

            <Text style={styles.totalLiveText}>
              3.842 LIVE
            </Text>
          </View>
        </View>

        <View style={styles.locationButton}>
          <Ionicons
            name="locate"
            size={21}
            color={colors.text}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171B1D",
  },

  fakeMap: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#242A2C",
  },

  seaLeft: {
    position: "absolute",
    left: -120,
    top: 0,
    bottom: 0,
    width: 210,
    backgroundColor: "#111719",
    transform: [{ rotate: "-5deg" }],
  },

  seaRight: {
    position: "absolute",
    right: -140,
    top: 0,
    bottom: 0,
    width: 210,
    backgroundColor: "#111719",
    transform: [{ rotate: "7deg" }],
  },

  mapLabel: {
    position: "absolute",
    color: "rgba(255,255,255,0.12)",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
  },

  portugal: {
    top: "52%",
    left: "8%",
    transform: [{ rotate: "-90deg" }],
  },

  spain: {
    top: "48%",
    left: "43%",
  },

  header: {
    position: "absolute",
    top: 18,
    left: 18,
    right: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 14,
    backgroundColor: "rgba(10,10,10,0.82)",
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },

  totalLive: {
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  headerLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.live,
  },

  totalLiveText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    fontWeight: "700",
  },

  locationButton: {
    width: 42,
    height: 42,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(10,10,10,0.82)",
  },

  cluster: {
    position: "absolute",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(10,10,10,0.90)",

    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },

  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  liveDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: colors.live,
  },

  clusterNumber: {
    color: colors.text,

    fontSize: 13,
    fontWeight: "800",
  },

  clusterCity: {
    marginTop: 2,

    color: "rgba(255,255,255,0.72)",

    fontSize: 9,
    fontWeight: "600",
  },
});