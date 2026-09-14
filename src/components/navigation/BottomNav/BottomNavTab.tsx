// src/components/navigation/BottomNav/BottomNavTab.tsx

import {
  Pressable,
  View,
} from "react-native";

import {
  type BottomNavItem,
} from "./bottomNav.config";

import {
  styles,
} from "./bottomNav.styles";

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
  const {
    Icon,
  } = item;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        item.label
      }
      accessibilityState={{
        selected: isActive,
      }}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tab,
        compact &&
          styles.tabCompact,
        pressed &&
          styles.itemPressed,
      ]}
    >
      <View
        style={[
          styles.tabIcon,
          compact &&
            styles.tabIconCompact,
        ]}
      >
        {isActive ? (
          <View
            pointerEvents="none"
            style={[
              styles.tabIconActiveBackground,
              compact &&
                styles.tabIconActiveBackgroundCompact,
            ]}
          />
        ) : null}

        <Icon
          size={
            compact
              ? 21
              : 23
          }
          color={
            isActive
              ? "#FFFFFF"
              : "#AEB2B8"
          }
          strokeWidth={
            isActive
              ? 2.5
              : 2.2
          }
        />
      </View>
    </Pressable>
  );
}