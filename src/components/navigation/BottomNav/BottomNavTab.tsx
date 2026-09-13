// src/components/navigation/BottomNav/BottomNavTab.tsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { colors } from "../../../styles";
import { type BottomNavItem } from "./bottomNav.config";
import { styles } from "./bottomNav.styles";

type BottomNavTabProps = { item: BottomNavItem; isActive: boolean; onPress: () => void };

export function BottomNavTab({ item, isActive, onPress }: BottomNavTabProps) {
  return (
    <Pressable style={styles.tab} onPress={onPress}>
      <Ionicons name={item.icon} size={26} color={isActive ? colors.text : colors.textOnOverlayMuted} />
      <Text style={[styles.label, isActive ? styles.activeLabel : undefined]}>{item.label}</Text>
    </Pressable>
  );
}
