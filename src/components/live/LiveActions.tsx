// src/components/live/LiveActions.tsx

import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type LiveActionsProps = {
  saved?: boolean;
  onProfilePress?: () => void;
  onSavePress?: () => void;
  onSharePress?: () => void;
  onMorePress?: () => void;
};

type ActionButtonProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label?: string;
  onPress?: () => void;
  active?: boolean;
};

function ActionButton({ icon, label, onPress, active = false }: ActionButtonProps) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <View style={[styles.circle, active && styles.activeCircle]}>
        <Ionicons name={icon} size={24} color={active ? "#08090A" : "#FFFFFF"} />
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

export function LiveActions({ saved = false, onProfilePress, onSavePress, onSharePress, onMorePress }: LiveActionsProps) {
  return (
    <View style={styles.container}>
      <ActionButton icon="person-outline" label="Perfil" onPress={onProfilePress} />
      <ActionButton icon={saved ? "star" : "star-outline"} label="Guardar" active={saved} onPress={onSavePress} />
      <ActionButton icon="arrow-redo-outline" label="Compartir" onPress={onSharePress} />
      <ActionButton icon="ellipsis-horizontal" onPress={onMorePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", right: 12, bottom: 154, alignItems: "center", gap: 15, zIndex: 20 },
  action: { alignItems: "center", gap: 4 },
  circle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.48)" },
  activeCircle: { backgroundColor: "#7CFF6B" },
  label: { maxWidth: 62, color: "#FFFFFF", fontSize: 9, fontWeight: "700", textAlign: "center" },
});
