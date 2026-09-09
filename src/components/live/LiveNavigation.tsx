// src/components/live/LiveNavigation.tsx

import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type LiveNavigationProps = {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function LiveNavigation({ currentIndex, total, onPrevious, onNext }: LiveNavigationProps) {
  if (total <= 1) return null;

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onPrevious}>
        <Ionicons name="chevron-up" size={20} color="#FFFFFF" />
      </Pressable>
      <Text style={styles.position}>{currentIndex + 1} / {total}</Text>
      <Pressable style={styles.button} onPress={onNext}>
        <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", top: 72, right: 14, alignItems: "center", gap: 5, zIndex: 30 },
  button: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.52)" },
  position: { color: "rgba(255,255,255,0.78)", fontSize: 10, fontWeight: "800" },
});
