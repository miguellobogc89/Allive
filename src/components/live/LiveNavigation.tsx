// src/components/live/LiveNavigation.tsx

import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, iconSizes, radius, typography } from "../../styles";

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
        <Ionicons name="chevron-up" size={iconSizes.md} color={colors.text} />
      </Pressable>
      <Text style={styles.position}>{currentIndex + 1} / {total}</Text>
      <Pressable style={styles.button} onPress={onNext}>
        <Ionicons name="chevron-down" size={iconSizes.md} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", top: 72, right: 14, alignItems: "center", gap: 5, zIndex: 30 },
  button: { width: 34, height: 34, borderRadius: radius.round, alignItems: "center", justifyContent: "center", backgroundColor: colors.overlayStrong },
  position: { color: colors.textSecondary, fontSize: 10, fontWeight: "800" },
});
