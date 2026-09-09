// src/components/BottomNav.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

type BottomNavProps = {
  activeTab: string;
  onTabPress: (tab: string) => void;
};

export function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
  const tabs = [
    { id: "now", label: "NOW", icon: "play-circle-outline" },
    { id: "map", label: "MAPA", icon: "map-outline" },
    { id: "emit", label: "EMITIR", icon: "radio-outline" },
    { id: "search", label: "BUSCAR", icon: "search-outline" },
    { id: "profile", label: "TÚ", icon: "person-outline" },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.35)",
          "rgba(0,0,0,0.78)",
        ]}
        locations={[0, 0.38, 1]}
        style={styles.gradient}
        pointerEvents="none"
      />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isEmit = tab.id === "emit";

        if (isEmit) {
          return (
            <Pressable
              key={tab.id}
              style={styles.emitWrapper}
              onPress={() => onTabPress(tab.id)}
            >
              <View style={styles.emitButton}>
                <View style={styles.emitInner}>
                  <View style={styles.emitDot} />
                </View>
              </View>

              <Text style={styles.emitLabel}>EMITIR</Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
          >
            <Ionicons
              name={tab.icon as any}
              size={26}
              color={
                isActive
                  ? colors.text
                  : "rgba(255,255,255,0.62)"
              }
            />

            <Text
              style={[
                styles.label,
                isActive ? styles.activeLabel : undefined,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    height: 105,

    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",

    paddingHorizontal: 8,
    paddingBottom: 12,

    zIndex: 100,
  },

  gradient: {
    ...StyleSheet.absoluteFill,
  },

  tab: {
    flex: 1,

    height: 58,

    alignItems: "center",
    justifyContent: "center",

    gap: 4,
  },

  label: {
    color: "rgba(255,255,255,0.62)",

    fontSize: 10,
    fontWeight: "600",
  },

  activeLabel: {
    color: colors.text,
    fontWeight: "800",
  },

  emitWrapper: {
    flex: 1,

    alignItems: "center",
    justifyContent: "flex-end",

    transform: [{ translateY: -3 }],
  },

  emitButton: {
    width: 54,
    height: 54,

    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(15,15,15,0.82)",

    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },

  emitInner: {
    width: 30,
    height: 30,

    borderRadius: 15,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: colors.live,
  },

  emitDot: {
    width: 14,
    height: 14,

    borderRadius: 7,

    backgroundColor: colors.live,
  },

  emitLabel: {
    marginTop: 3,

    color: colors.text,

    fontSize: 9,
    fontWeight: "800",
  },
});