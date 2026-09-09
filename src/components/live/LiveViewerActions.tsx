// src/components/live/LiveViewerActions.tsx

import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, controls, iconSizes, layout, typography } from "../../styles";

type LiveViewerActionsProps = {
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
        <Ionicons name={icon} size={iconSizes.action} color={active ? colors.background : colors.text} />
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

export function LiveViewerActions({ saved = false, onProfilePress, onSavePress, onSharePress, onMorePress }: LiveViewerActionsProps) {
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
  container: { position: "absolute", right: layout.liveActionsRight, bottom: layout.liveActionsBottom, alignItems: "center", gap: controls.actionGap, zIndex: 20 },
  action: { alignItems: "center", gap: controls.actionInnerGap },
  circle: { width: controls.actionCircleSize, height: controls.actionCircleSize, borderRadius: controls.actionCircleSize / 2, alignItems: "center", justifyContent: "center", backgroundColor: colors.overlay },
  activeCircle: { backgroundColor: colors.accent },
  label: { maxWidth: controls.actionLabelMaxWidth, color: colors.text, ...typography.micro, textAlign: "center" },
});
