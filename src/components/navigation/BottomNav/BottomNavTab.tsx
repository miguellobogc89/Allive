// src/components/navigation/BottomNav/BottomNavTab.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  View,
} from "react-native";
import { colors } from "../../../styles";
import { type BottomNavItem } from "./bottomNav.config";
import { styles } from "./bottomNav.styles";

type BottomNavTabProps = {
  item: BottomNavItem;
  isActive: boolean;
  compact: boolean;
  onPress: () => void;
};

export function BottomNavTab({
  item,
  isActive,
  compact,
  onPress,
}: BottomNavTabProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isActive }}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tab,
        compact && styles.tabCompact,
        pressed && styles.itemPressed,
      ]}
    >
      <View
        style={[
          styles.tabIcon,
          isActive && styles.tabIconActive,
          compact && styles.tabIconCompact,
        ]}
      >
        <Ionicons
          name={isActive ? item.activeIcon : item.icon}
          size={compact ? 23 : 24}
          color={
            isActive
              ? colors.text
              : colors.textOnOverlayMuted
          }
        />
      </View>

      {!compact && (
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            isActive && styles.activeLabel,
          ]}
        >
          {item.label}
        </Text>
      )}
    </Pressable>
  );
}