// src/screens/HotScreen.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Flame,
} from "lucide-react-native";

export function HotScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Flame
          size={30}
          color="#FFFFFF"
          strokeWidth={2.2}
        />
      </View>

      <Text style={styles.title}>
        Hot
      </Text>

      <Text style={styles.message}>
        Próximamente
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#08090B",
    paddingBottom: 70,
  },

  icon: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 29,
    backgroundColor:
      "rgba(255,255,255,0.08)",
    marginBottom: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },

  message: {
    color: "#8E939B",
    fontSize: 15,
    fontWeight: "500",
  },
});