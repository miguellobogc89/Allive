// src/screens/MapScreen.native.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { colors } from "../theme/colors";

const liveClusters = [
  {
    id: "madrid",
    city: "Madrid",
    lives: 1284,
    latitude: 40.4168,
    longitude: -3.7038,
  },
  {
    id: "barcelona",
    city: "Barcelona",
    lives: 846,
    latitude: 41.3874,
    longitude: 2.1686,
  },
  {
    id: "sevilla",
    city: "Sevilla",
    lives: 318,
    latitude: 37.3891,
    longitude: -5.9845,
  },
  {
    id: "valencia",
    city: "Valencia",
    lives: 271,
    latitude: 39.4699,
    longitude: -0.3763,
  },
  {
    id: "malaga",
    city: "Málaga",
    lives: 164,
    latitude: 36.7213,
    longitude: -4.4214,
  },
  {
    id: "chiclana",
    city: "Chiclana",
    lives: 37,
    latitude: 36.4198,
    longitude: -6.149,
  },
];

export function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 39.6,
          longitude: -3.7,
          latitudeDelta: 9,
          longitudeDelta: 9,
        }}
      >
        {liveClusters.map((cluster) => (
          <Marker
            key={cluster.id}
            coordinate={{
              latitude: cluster.latitude,
              longitude: cluster.longitude,
            }}
          >
            <View
              style={[
                styles.cluster,
                cluster.lives > 1000
                  ? styles.clusterLarge
                  : cluster.lives > 300
                    ? styles.clusterMedium
                    : styles.clusterSmall,
              ]}
            >
              <View style={styles.liveRow}>
                <View style={styles.liveDot} />

                <Text style={styles.clusterNumber}>
                  {cluster.lives.toLocaleString("es-ES")}
                </Text>
              </View>

              <Text style={styles.clusterCity}>
                {cluster.city}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ahora</Text>

          <View style={styles.totalLive}>
            <View style={styles.headerLiveDot} />
            <Text style={styles.totalLiveText}>3.842 LIVE</Text>
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
    backgroundColor: colors.background,
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
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(10,10,10,0.88)",

    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.92)",
  },

  clusterLarge: {
    width: 82,
    height: 82,

    borderRadius: 41,
  },

  clusterMedium: {
    width: 70,
    height: 70,

    borderRadius: 35,
  },

  clusterSmall: {
    width: 60,
    height: 60,

    borderRadius: 30,
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